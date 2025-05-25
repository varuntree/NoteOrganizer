import React, { useState, useEffect, useRef } from 'react';

interface EmotionalEyesProps {
  inputValue: string;
  cursorPosition: number;
  isActive: boolean;
  onTypingSpeedChange?: (isFast: boolean) => void;
}

const EmotionalEyes: React.FC<EmotionalEyesProps> = ({ 
  inputValue, 
  cursorPosition, 
  isActive,
  onTypingSpeedChange
}) => {
  const [eyeTarget, setEyeTarget] = useState({ x: 0, y: 8 });
  const [leftBlink, setLeftBlink] = useState(false);
  const [rightBlink, setRightBlink] = useState(false);
  const [emotion, setEmotion] = useState('neutral');
  const [pupilSize, setPupilSize] = useState(1);
  const [eyeColor, setEyeColor] = useState('blue');
  const [eyebrowPosition, setEyebrowPosition] = useState(0);
  const [isTypingFast, setIsTypingFast] = useState(false);
  const [typingIntensity, setTypingIntensity] = useState(0);
  const [emotionIntensity, setEmotionIntensity] = useState(1);
  const [eyeShake, setEyeShake] = useState(false);
  const [tearDrop, setTearDrop] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const [heartEyes, setHeartEyes] = useState(false);
  const [angerPulse, setAngerPulse] = useState(false);
  const [surprise, setSurprise] = useState(false);
  const [currentlyTyping, setCurrentlyTyping] = useState(false);
  
  const typingSpeedRef = useRef<number[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastValueRef = useRef(inputValue);

  // Enhanced emotion analysis
  const analyzeEmotion = (text: string) => {
    const happyWords = ['happy', 'joy', 'love', 'amazing', 'wonderful', 'great', 'awesome', 'fantastic', 'perfect', 'beautiful', '😊', '❤️', '🎉', '😍', '🥰'];
    const sadWords = ['sad', 'cry', 'hurt', 'pain', 'sorry', 'terrible', 'awful', 'bad', 'depressed', 'broken', '😢', '💔', '😭'];
    const excitedWords = ['wow', 'omg', 'incredible', 'amazing', 'yes', '!!!', 'awesome', 'epic', 'insane', 'mind-blowing', '🔥', '✨', '🚀', '⚡'];
    const angryWords = ['angry', 'mad', 'furious', 'hate', 'stupid', 'damn', 'hell', 'rage', 'annoying', '😡', '🤬', '💢'];
    const loveWords = ['love', 'adore', 'crush', 'heart', 'kiss', 'romance', 'baby', 'honey', '💕', '💖', '😘', '🥰'];
    
    const lowerText = text.toLowerCase();
    
    // Count emotion word matches
    const happyCount = happyWords.filter(word => lowerText.includes(word)).length;
    const sadCount = sadWords.filter(word => lowerText.includes(word)).length;
    const excitedCount = excitedWords.filter(word => lowerText.includes(word)).length;
    const angryCount = angryWords.filter(word => lowerText.includes(word)).length;
    const loveCount = loveWords.filter(word => lowerText.includes(word)).length;
    
    // Determine strongest emotion
    const maxCount = Math.max(happyCount, sadCount, excitedCount, angryCount, loveCount);
    
    if (loveCount === maxCount && loveCount > 0) return { emotion: 'love', intensity: Math.min(loveCount * 0.5 + 1, 3) };
    if (excitedCount === maxCount && excitedCount > 0) return { emotion: 'excited', intensity: Math.min(excitedCount * 0.5 + 1, 3) };
    if (angryCount === maxCount && angryCount > 0) return { emotion: 'angry', intensity: Math.min(angryCount * 0.5 + 1, 3) };
    if (happyCount === maxCount && happyCount > 0) return { emotion: 'happy', intensity: Math.min(happyCount * 0.5 + 1, 3) };
    if (sadCount === maxCount && sadCount > 0) return { emotion: 'sad', intensity: Math.min(sadCount * 0.5 + 1, 3) };
    
    return { emotion: 'neutral', intensity: 1 };
  };

  // Enhanced typing speed calculation
  const calculateTypingSpeed = () => {
    const now = Date.now();
    typingSpeedRef.current.push(now);
    
    // Keep only last 8 keystrokes for better accuracy
    if (typingSpeedRef.current.length > 8) {
      typingSpeedRef.current.shift();
    }
    
    if (typingSpeedRef.current.length >= 3) {
      const timeDiff = now - typingSpeedRef.current[0];
      const speed = typingSpeedRef.current.length / (timeDiff / 1000);
      
      // Enhanced speed detection
      if (speed > 5) {
        setIsTypingFast(true);
        setTypingIntensity(Math.min(speed / 2, 4)); // Scale intensity
        setEyeShake(true);
      } else if (speed > 3) {
        setIsTypingFast(true);
        setTypingIntensity(2);
        setEyeShake(false);
      } else {
        setIsTypingFast(false);
        setTypingIntensity(1);
        setEyeShake(false);
      }
      
      onTypingSpeedChange?.(speed > 4);
    }
  };

  // Handle input changes with enhanced effects
  useEffect(() => {
    if (inputValue !== lastValueRef.current) {
      const oldLength = lastValueRef.current.length;
      const newLength = inputValue.length;
      
      setCurrentlyTyping(true);
      calculateTypingSpeed();
      
      // Detect deletion with more drama
      if (newLength < oldLength) {
        setTearDrop(true);
        setTimeout(() => setTearDrop(false), 3000);
      }
      
      // Analyze emotions with intensity
      const emotionResult = analyzeEmotion(inputValue);
      setEmotion(emotionResult.emotion);
      setEmotionIntensity(emotionResult.intensity);
      
      // Special emotion effects
      if (emotionResult.emotion === 'love') {
        setHeartEyes(true);
        setTimeout(() => setHeartEyes(false), 2000);
      }
      
      if (emotionResult.emotion === 'angry') {
        setAngerPulse(true);
        setTimeout(() => setAngerPulse(false), 1500);
      }
      
      // Surprise on first character
      if (oldLength === 0 && newLength === 1) {
        setSurprise(true);
        setTimeout(() => setSurprise(false), 800);
      }
      
      // Enhanced sparkle triggers
      if (['!!!', '✨', '🔥', 'wow', 'amazing', 'incredible', 'mind-blowing'].some(word => inputValue.toLowerCase().includes(word))) {
        setSparkle(true);
        setTimeout(() => setSparkle(false), 2000);
      }
      
      lastValueRef.current = inputValue;
      
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setCurrentlyTyping(false);
        setIsTypingFast(false);
        setTypingIntensity(1);
        setEyeShake(false);
      }, 500);
    }
  }, [inputValue]);

  // Eye tracking based on cursor
  useEffect(() => {
    if (isActive) {
      const normalizedPosition = cursorPosition / Math.max(1, inputValue.length);
      const eyeX = (normalizedPosition - 0.5) * 20;
      const eyeY = 10 + (currentlyTyping ? 3 : 0);
      setEyeTarget({ x: eyeX, y: eyeY });
    } else {
      setEyeTarget({ x: 0, y: 0 });
    }
  }, [cursorPosition, inputValue, isActive, currentlyTyping]);

  // Enhanced eye effects based on emotions AND typing
  useEffect(() => {
    const baseIntensity = emotionIntensity * (currentlyTyping ? 1.5 : 1);
    
    switch (emotion) {
      case 'happy':
        setPupilSize(1 + (baseIntensity * 0.3));
        setEyeColor(isTypingFast ? 'red' : 'emerald');
        setEyebrowPosition(-2 * baseIntensity);
        break;
      case 'sad':
        setPupilSize(1 - (baseIntensity * 0.2));
        setEyeColor(isTypingFast ? 'red' : 'gray');
        setEyebrowPosition(3 * baseIntensity);
        break;
      case 'excited':
        setPupilSize(1 + (baseIntensity * 0.5));
        setEyeColor(isTypingFast ? 'red' : 'orange');
        setEyebrowPosition(-4 * baseIntensity);
        break;
      case 'angry':
        setPupilSize(1 + (baseIntensity * 0.4));
        setEyeColor(isTypingFast ? 'crimson' : 'red');
        setEyebrowPosition(-6 * baseIntensity);
        break;
      case 'love':
        setPupilSize(1 + (baseIntensity * 0.6));
        setEyeColor(isTypingFast ? 'red' : 'pink');
        setEyebrowPosition(-1 * baseIntensity);
        break;
      default:
        setPupilSize(1 + (isTypingFast ? 0.3 : 0));
        setEyeColor(isTypingFast ? 'red' : 'blue');
        setEyebrowPosition(0);
    }
  }, [emotion, emotionIntensity, isTypingFast, currentlyTyping]);

  // Enhanced blinking with emotions
  useEffect(() => {
    const createEmotionalBlink = () => {
      let blinkSpeed = 120;
      let blinkFrequency = 2000;
      
      // Adjust blinking based on emotion
      switch (emotion) {
        case 'excited':
          blinkSpeed = 80;
          blinkFrequency = 800;
          break;
        case 'angry':
          blinkSpeed = 60;
          blinkFrequency = 1500;
          break;
        case 'sad':
          blinkSpeed = 200;
          blinkFrequency = 3000;
          break;
        case 'love':
          blinkSpeed = 150;
          blinkFrequency = 1200;
          break;
      }
      
      if (isTypingFast) {
        blinkSpeed = 50;
        blinkFrequency = 600;
      }
      
      setLeftBlink(true);
      setRightBlink(true);
      setTimeout(() => {
        setLeftBlink(false);
        setRightBlink(false);
      }, blinkSpeed);
      
      setTimeout(createEmotionalBlink, blinkFrequency + Math.random() * 1000);
    };

    if (!isActive) {
      const timer = setTimeout(createEmotionalBlink, 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive, emotion, isTypingFast]);

  const Eye = ({ isLeft = true, blink }: { isLeft?: boolean; blink: boolean }) => {
    const colorMap = {
      blue: 'from-blue-400 to-blue-600',
      emerald: 'from-emerald-400 to-emerald-600',
      orange: 'from-orange-400 to-orange-600',
      red: 'from-red-500 to-red-700',
      crimson: 'from-red-600 to-red-900',
      gray: 'from-gray-400 to-gray-600',
      pink: 'from-pink-400 to-pink-600'
    };

    const eyeTransform = `
      scale(${surprise ? 1.3 : (emotion === 'excited' && currentlyTyping) ? 1.15 : 1})
      ${eyeShake ? `translateX(${Math.sin(Date.now() / 100) * 2}px)` : ''}
      ${angerPulse ? 'scale(1.1)' : ''}
    `;

    return (
      <div className="relative">
        {/* Dynamic Eyebrow */}
        <div 
          className={`absolute -top-3 left-1/2 transform -translate-x-1/2 h-1.5 rounded-full transition-all duration-200 ${
            emotion === 'angry' ? 'bg-red-700 w-14' : 'bg-gray-700 w-12'
          }`}
          style={{
            transform: `translateX(-50%) translateY(${eyebrowPosition}px) ${
              emotion === 'angry' ? 'rotate(-15deg) scaleX(1.3)' : 
              emotion === 'excited' ? 'scaleX(1.4)' : 'scaleX(1)'
            }`,
            opacity: currentlyTyping ? 1 : 0.8
          }}
        />

        {/* Eye socket with dynamic sizing */}
        <div 
          className={`w-16 h-16 rounded-full bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-inner border transition-all duration-150 ${
            blink ? 'scale-y-0' : 'scale-y-100'
          } ${
            emotion === 'angry' ? 'border-red-300' : 'border-gray-200/50'
          } ${
            angerPulse ? 'animate-pulse' : ''
          }`}
          style={{ 
            transform: eyeTransform,
            borderWidth: currentlyTyping ? '2px' : '1px'
          }}
        >
          {/* Enhanced Iris */}
          <div 
            className={`absolute w-10 h-10 rounded-full bg-gradient-to-br ${colorMap[eyeColor as keyof typeof colorMap]} shadow-lg transition-all duration-300 ${
              isTypingFast ? 'animate-pulse' : ''
            }`}
            style={{
              left: `${12 + eyeTarget.x * (isLeft ? 1 : 0.9)}px`,
              top: `${12 + eyeTarget.y}px`,
              transform: `scale(${currentlyTyping ? 1.2 : 1}) ${
                emotion === 'love' ? 'scale(1.1)' : ''
              }`,
              boxShadow: isTypingFast ? '0 0 20px rgba(255, 0, 0, 0.5)' : 'default'
            }}
          >
            {/* Enhanced Pupil */}
            <div 
              className="absolute bg-black rounded-full transition-all duration-150"
              style={{
                width: `${24 * pupilSize}px`,
                height: `${24 * pupilSize}px`,
                left: `${20 - 12 * pupilSize}px`,
                top: `${20 - 12 * pupilSize}px`,
                boxShadow: currentlyTyping ? 'inset 0 0 10px rgba(0,0,0,0.8)' : 'none'
              }}
            >
              {/* Heart pupils for love */}
              {heartEyes ? (
                <div className="absolute inset-0 flex items-center justify-center text-red-500 text-xs">❤️</div>
              ) : (
                <>
                  <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-1 left-1 opacity-95"></div>
                  <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-3 left-2.5 opacity-60"></div>
                </>
              )}
            </div>
            
            {/* Enhanced iris patterns */}
            <div className="absolute inset-1 rounded-full border border-white/25"></div>
            <div className="absolute inset-2 rounded-full border border-white/20"></div>
            {currentlyTyping && (
              <div className="absolute inset-3 rounded-full border border-white/15"></div>
            )}
          </div>
        </div>
        
        {/* Enhanced Eyelid */}
        <div 
          className={`absolute inset-0 bg-gradient-to-b from-rose-100 via-rose-50 to-pink-100 rounded-full transition-all duration-100 origin-top ${
            blink ? 'scale-y-100' : 'scale-y-0'
          }`}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-gray-800/40 rounded-full"></div>
        </div>

        {/* Enhanced Tear effects */}
        {tearDrop && (
          <div className="absolute bottom-0 left-6">
            <div className="w-1.5 h-6 bg-blue-400 rounded-full animate-bounce opacity-80"></div>
            <div className="w-1 h-4 bg-blue-300 rounded-full animate-bounce opacity-60 ml-0.5 -mt-2" style={{animationDelay: '0.2s'}}></div>
          </div>
        )}

        {/* Enhanced Sparkles */}
        {sparkle && (
          <div className="absolute -inset-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 80}px`,
                  top: `${Math.random() * 80}px`,
                  animationDelay: `${i * 100}ms`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        )}

        {/* Fire effect for fast typing */}
        {isTypingFast && typingIntensity > 3 && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="text-red-500 animate-bounce">🔥</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex justify-center gap-6 transition-all duration-300 ${
      isActive ? 'opacity-100' : 'opacity-30'
    }`}>
      <Eye isLeft={true} blink={leftBlink} />
      <Eye isLeft={false} blink={rightBlink} />
    </div>
  );
};

export default EmotionalEyes;