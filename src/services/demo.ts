export interface GenerationInput {
  brandName: string
  productName: string
  audienceName: string
  contentType: string
  tone: string
  channel: string
  brief: string
  language: string
}
export function composeDemoText(input: GenerationInput): string {
  const { brandName, productName, audienceName, contentType, tone, channel, brief, language } =
    input
  if (language.toLowerCase().startsWith('vi'))
    return `${brandName} — Một chút cảm hứng cho ngày mới.\n\nKhám phá ${productName}, được tạo nên bằng sự tận tâm dành cho ${audienceName}. Mỗi chi tiết là một lời mời bạn sống chậm lại và tận hưởng điều mình yêu thích.\n\n${brief ? `Ý tưởng chiến dịch: ${brief}\n\n` : ''}Tìm hiểu câu chuyện của ${brandName} hôm nay.\n\n#${brandName.replace(/\s/g, '')} #CraftedWithCare\n\n[Bản nháp mẫu ${contentType} cho ${channel}; giọng điệu: ${tone}.]`
  return `${brandName} — a little more intention, every day.\n\nMeet ${productName}. Thoughtfully crafted for ${audienceName.toLowerCase()}, with care in every detail and a story worth sharing.\n\n${brief ? `Campaign direction: ${brief}\n\n` : ''}Make room for what matters. Discover ${productName} with ${brandName} today.\n\n#${brandName.replace(/\s/g, '')} #CraftedWithCare\n\n[Demo ${contentType} draft for ${channel}; tone: ${tone}.]`
}
export async function generateText(input: GenerationInput): Promise<string> {
  if (!input.brandName || !input.productName || !input.audienceName)
    throw new Error('Choose a brand, product, and target audience first.')
  await new Promise((resolve) => window.setTimeout(resolve, 700))
  return composeDemoText(input)
}
export async function generateImage(input: {
  prompt: string
  aspectRatio: string
  style: string
}): Promise<string> {
  if (!input.prompt.trim()) throw new Error('Enter an image prompt first.')
  await new Promise((resolve) => window.setTimeout(resolve, 850))
  return '/assets/demo-image.svg'
}
