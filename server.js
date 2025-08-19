const path = require('path');
require('dotenv').config();
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');

app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

// Contact form -> email
app.post('/api/contact', async (req, res) => {
  try {
    const { first, last, email, message } = req.body || {};
    if (!first || !last || !email || !message) {
      return res.status(400).json({ ok: false, error: 'Champs requis manquants.' });
    }
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({ ok: false, error: 'Configuration SMTP manquante côté serveur.' });
    }

    const port = Number(process.env.SMTP_PORT) || 587;
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const to = process.env.CONTACT_TO || process.env.SMTP_USER;
    const from = process.env.CONTACT_FROM || process.env.SMTP_USER;
    const subject = `Nouveau message du site — ${first} ${last}`;
    const plain = `De: ${first} ${last} <${email}>
Message:\n${message}`;
    const html = `<p><strong>De:</strong> ${first} ${last} &lt;${email}&gt;</p><p><strong>Message:</strong><br>${String(message).replace(/\n/g,'<br>')}</p>`;

    await transporter.sendMail({ from, to, subject, text: plain, html, replyTo: email });
    res.json({ ok: true });
  } catch (err) {
    console.error('Mail error:', err?.message || err);
    res.status(500).json({ ok: false, error: "Erreur lors de l'envoi de l'email." });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body || {};
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY manquant côté serveur.' });
    }
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Payload invalide: messages attendu.' });
    }

    const OpenAI = require('openai');
    const baseURL = process.env.OPENAI_BASE_URL || process.env.AI_API_BASE_URL || 'https://api.moonshot.cn/v1'; // Kimi par défaut
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, ...(baseURL ? { baseURL } : {}) });

    const model = process.env.OPENAI_MODEL || process.env.AI_MODEL || 'moonshot-v1-8k'; // Kimi par défaut

    const completion = await client.chat.completions.create({
      model,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            "Tu es l’assistant d’automatisation de Victor Automations. Réponds en français, de manière brève, claire et utile. Propose de réserver via le lien agenda si pertinent.",
        },
        ...messages,
      ],
    });

    const reply = completion.choices?.[0]?.message?.content || 'Réponse reçue.';
    res.json({ reply });
  } catch (err) {
    console.error('OpenAI error:', err?.response?.data || err?.message || err);
    res.status(500).json({ error: 'Erreur lors de l’appel à OpenAI.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});


