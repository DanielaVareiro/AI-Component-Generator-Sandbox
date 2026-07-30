import 'dotenv/config';
import Groq from 'groq-sdk';
const groq = new Groq();
async function testarGroq() {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: 'Olá Groq! Responda apenas com: Conexão realizada com sucesso!',
                },
            ],
            model: 'llama-3.3-70b-versatile',
        });
        console.log('🤖 Resposta do Groq:');
        console.log(chatCompletion.choices[0]?.message?.content);
    }
    catch (error) {
        console.error('❌ Erro ao conectar com o Groq:', error);
    }
}
testarGroq();
