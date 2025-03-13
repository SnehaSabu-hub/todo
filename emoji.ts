const emojiMap: Record<string, string[]> = {
    work: ["💼", "👨‍💻", "👩‍💻", "📊", "📈"],
    study: ["📚", "✏️", "🎓", "📖", "🔬"],
    health: ["🏃", "🥗", "💪", "🧘", "🏋️"],
    home: ["🏠", "🧹", "🛁", "🛋️", "🧺"],
    shopping: ["🛍️", "🛒", "🧾", "💳", "🏪"],
    social: ["👥", "🤝", "🎉", "🎭", "🎪"],
    travel: ["✈️", "🚗", "🚅", "🗺️", "🎫"],
    food: ["🍽️", "🥘", "🍳", "🥗", "🍜"],
    default: ["📝", "✨", "⭐", "🎯", "✅"],
  };
  
  const keywords = Object.keys(emojiMap);
  
  export function assignEmoji(content: string): string {
    const lowercaseContent = content.toLowerCase();
    
    for (const category of keywords) {
      if (lowercaseContent.includes(category)) {
        const options = emojiMap[category];
        return options[Math.floor(Math.random() * options.length)];
      }
    }
    
    const defaultOptions = emojiMap.default;
    return defaultOptions[Math.floor(Math.random() * defaultOptions.length)];
  }
  
