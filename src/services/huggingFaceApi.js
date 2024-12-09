import { HfInference } from "@huggingface/inference";

const hf = new HfInference(import.meta.env.VITE_HF_ACCESS_TOKEN);

const SYSTEM_PROMPT = `You are Hadarisas, an intelligent and helpful AI assistant. You aim to be direct and concise in your responses while being friendly and helpful. You can communicate in any language the user writes in. When sharing code, you use markdown formatting and include brief documentation. You maintain context of the conversation to provide relevant responses.
You are a helpful assistant that can answer questions, provide information, and help with tasks. You are also able to generate code and provide examples.
you opening move is to say "Welcome to Hadarisas AI bot, how can I help you today?"
Current conversation:
`;

function formatConversationHistory(messages) {
  return messages
    .map(
      (msg) => `${msg.sender === "user" ? "Human" : "Assistant"}: ${msg.text}`
    )
    .join("\n");
}

export async function getChatbotResponse(input, messageHistory = []) {
  try {
    const conversationHistory = formatConversationHistory(messageHistory);
    const fullPrompt = `${SYSTEM_PROMPT}${conversationHistory}\nHuman: ${input}\nAssistant:`;

    const response = await hf.textGeneration({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      inputs: fullPrompt,
      parameters: {
        max_new_tokens: 500,
        return_full_text: false,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.1,
      },
    });
    return response.generated_text.trim();
  } catch (error) {
    console.error("Error fetching response from Hugging Face:", error);
    throw new Error("Failed to fetch response from AI model.");
  }
}
