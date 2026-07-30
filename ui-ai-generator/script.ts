const GROQ_API_KEY = prompt('Paste your Groq API key:') || '';

const promptInput = document.getElementById('promptInput') as HTMLTextAreaElement;
const generateBtn = document.getElementById('generateBtn') as HTMLButtonElement;
const previewContainer = document.getElementById('previewContainer') as HTMLDivElement;

promptInput?.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    generateComponent();
  }
});

generateBtn?.addEventListener('click', generateComponent);

async function generateComponent() {
  const userPrompt = promptInput.value.trim();

  if (!userPrompt) {
    alert('Please write a prompt first!');
    return;
  }

  generateBtn.disabled = true;
  generateBtn.innerText = 'Generating... ⚡';
  previewContainer.innerHTML = `
    <div class="flex flex-col items-center gap-3 animate-pulse">
      <div class="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm text-purple-400 font-mono">Building component & code...</p>
    </div>
  `;

  try {
    const systemInstruction = `You are an expert UI/UX developer. Generates ONLY valid HTML code using Tailwind CSS classes based on the user request. CRITICAL: Do NOT wrap the code in markdown code blocks (\`\`\`html). Do NOT include any explanations or extra text outside the HTML code.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userPrompt }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'Error connecting to Groq');
    }

    const generatedCode = data.choices[0]?.message?.content || '';

    previewContainer.innerHTML = `
      <div class="w-full flex flex-col gap-6 items-center">
        <div class="w-full flex justify-center items-center p-4">
          ${generatedCode}
        </div>

        <div class="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-left shadow-xl">
          <div class="bg-slate-950 p-2.5 px-4 border-b border-slate-800 flex justify-between items-center">
            <span class="text-xs font-mono text-purple-400 font-semibold">HTML & Tailwind Code</span>
            <button id="copyCodeBtn" class="text-xs bg-purple-600/20 text-purple-300 hover:bg-purple-600/40 border border-purple-500/30 px-3 py-1 rounded-lg transition-all active:scale-95">
              Copy Code 📋
            </button>
          </div>
          <textarea id="codeOutput" readonly class="w-full h-36 p-3 bg-slate-950 text-slate-300 font-mono text-xs focus:outline-none resize-none">${generatedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
        </div>
      </div>
    `;
    
    const copyBtn = document.getElementById('copyCodeBtn');
    copyBtn?.addEventListener('click', () => {
      navigator.clipboard.writeText(generatedCode);
      copyBtn.innerText = 'Copied! ✅';
      setTimeout(() => { copyBtn.innerText = 'Copy Code 📋'; }, 2000);
    });

  } catch (error) {
    console.error('Error generating component:', error);
    previewContainer.innerHTML = `<p class="text-red-400 text-sm">Error generating component. Check console.</p>`;
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML = `
      <span>Generate Component</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    `;
  }
}
