import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Trophy, Star, MessageCircle, Mic, Book, Headphones, Zap, ChevronRight, Award, Volume2, Check, X, TrendingUp, Globe, Film, Newspaper } from 'lucide-react';

const EnglishLearningApp = () => {
  // State management
  const [currentView, setCurrentView] = useState('home');
  const [userProfile, setUserProfile] = useState({
    name: 'Learner',
    level: 1,
    xp: 0,
    streak: 0,
    totalXP: 0,
    completedLessons: [],
    achievements: []
  });
  const [currentLesson, setCurrentLesson] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState(null);
  const chatEndRef = useRef(null);

  // Load user data from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('englishLearnerProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  // Save user data to localStorage
  useEffect(() => {
    localStorage.setItem('englishLearnerProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Learning path structure
  const learningPath = {
    beginner: {
      title: '基礎入門',
      color: '#10b981',
      lessons: [
        { id: 'b1', title: '日常問候', xp: 50, topics: ['Hello', 'Good morning', 'How are you'], type: 'conversation' },
        { id: 'b2', title: '自我介紹', xp: 75, topics: ['My name is', 'I am from', 'I work as'], type: 'conversation' },
        { id: 'b3', title: '數字與時間', xp: 60, topics: ['Numbers 1-100', 'Telling time', 'Days of week'], type: 'vocabulary' },
        { id: 'b4', title: '購物基礎', xp: 80, topics: ['How much', 'I want', 'Shopping phrases'], type: 'conversation' },
        { id: 'b5', title: '餐廳點餐', xp: 90, topics: ['Menu items', 'Ordering food', 'Restaurant etiquette'], type: 'conversation' },
      ]
    },
    intermediate: {
      title: '中級進階',
      color: '#3b82f6',
      lessons: [
        { id: 'i1', title: '旅遊英文', xp: 100, topics: ['Directions', 'Hotel check-in', 'Airport phrases'], type: 'conversation' },
        { id: 'i2', title: '職場溝通', xp: 120, topics: ['Email writing', 'Meeting phrases', 'Professional vocabulary'], type: 'conversation' },
        { id: 'i3', title: '時事討論', xp: 110, topics: ['Current events', 'Expressing opinions', 'Debate skills'], type: 'news' },
        { id: 'i4', title: '電話溝通', xp: 100, topics: ['Phone etiquette', 'Making appointments', 'Business calls'], type: 'conversation' },
        { id: 'i5', title: '影視對話', xp: 130, topics: ['Movie quotes', 'TV show dialogues', 'Slang and idioms'], type: 'media' },
      ]
    },
    advanced: {
      title: '高級精通',
      color: '#8b5cf6',
      lessons: [
        { id: 'a1', title: '學術討論', xp: 150, topics: ['Academic vocabulary', 'Presentations', 'Research discussions'], type: 'conversation' },
        { id: 'a2', title: '商務談判', xp: 180, topics: ['Negotiation skills', 'Business strategy', 'Contract terms'], type: 'conversation' },
        { id: 'a3', title: '文學賞析', xp: 160, topics: ['Literary devices', 'Classic literature', 'Poetry analysis'], type: 'reading' },
        { id: 'a4', title: '新聞深度分析', xp: 170, topics: ['News analysis', 'Critical thinking', 'Media literacy'], type: 'news' },
        { id: 'a5', title: '跨文化交流', xp: 200, topics: ['Cultural nuances', 'International etiquette', 'Global communication'], type: 'conversation' },
      ]
    },
    expert: {
      title: '專業大師',
      color: '#f59e0b',
      lessons: [
        { id: 'e1', title: '同步口譯訓練', xp: 250, topics: ['Real-time interpretation', 'Speed listening', 'Translation skills'], type: 'listening' },
        { id: 'e2', title: '演講技巧', xp: 300, topics: ['Public speaking', 'TED-style presentations', 'Storytelling'], type: 'pronunciation' },
        { id: 'e3', title: '專業寫作', xp: 280, topics: ['Academic writing', 'Creative writing', 'Technical documentation'], type: 'writing' },
        { id: 'e4', title: '辯論大師', xp: 320, topics: ['Debate strategies', 'Rhetorical devices', 'Argumentation'], type: 'conversation' },
        { id: 'e5', title: '全球時事評論', xp: 350, topics: ['World affairs', 'Political discourse', 'Economic analysis'], type: 'news' },
      ]
    }
  };

  // XP thresholds for leveling up
  const getXPForLevel = (level) => level * 500;
  const getProgressToNextLevel = () => {
    const currentLevelXP = getXPForLevel(userProfile.level - 1);
    const nextLevelXP = getXPForLevel(userProfile.level);
    const progress = ((userProfile.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return Math.min(progress, 100);
  };

  // Award XP and check for level up
  const awardXP = (amount) => {
    const newTotalXP = userProfile.totalXP + amount;
    let newLevel = userProfile.level;
    
    while (newTotalXP >= getXPForLevel(newLevel)) {
      newLevel++;
    }

    setUserProfile(prev => ({
      ...prev,
      xp: prev.xp + amount,
      totalXP: newTotalXP,
      level: newLevel
    }));

    if (newLevel > userProfile.level) {
      // Level up celebration
      setTimeout(() => {
        alert(`🎉 恭喜！你升到 ${newLevel} 級了！`);
      }, 500);
    }
  };

  // Complete lesson
  const completeLesson = (lessonId, xpEarned) => {
    if (!userProfile.completedLessons.includes(lessonId)) {
      setUserProfile(prev => ({
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        streak: prev.streak + 1
      }));
      awardXP(xpEarned);
    }
  };

  // AI Chat function using Anthropic API
  const sendMessageToAI = async (message, lessonContext) => {
    setIsLoading(true);
    setChatMessages(prev => [...prev, { role: 'user', content: message }]);

    try {
      const systemPrompt = lessonContext 
        ? `You are an English teacher helping a student practice "${lessonContext.title}". 
           Topics to cover: ${lessonContext.topics.join(', ')}. 
           Provide conversational practice, correct mistakes gently, and give encouragement.
           Respond in a mix of English and Traditional Chinese to help learning.
           Keep responses concise and engaging.`
        : `You are a friendly English conversation partner. Help the user practice English naturally.
           Mix English and Traditional Chinese in your responses to aid learning.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            ...chatMessages,
            { role: 'user', content: message }
          ],
          system: systemPrompt
        })
      });

      const data = await response.json();
      const aiMessage = data.content[0].text;

      setChatMessages(prev => [...prev, { role: 'assistant', content: aiMessage }]);
      
      // Award XP for interaction
      awardXP(10);
      
    } catch (error) {
      console.error('AI Error:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    }

    setIsLoading(false);
  };

  // Speech recognition
  const startSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('您的瀏覽器不支持語音識別功能');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      setSpeechFeedback(null);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;

      setUserInput(transcript);
      setSpeechFeedback({
        text: transcript,
        confidence: confidence,
        score: Math.round(confidence * 100)
      });

      // Award XP for pronunciation practice
      if (confidence > 0.7) {
        awardXP(20);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  // Text to speech
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Start lesson
  const startLesson = (lesson, level) => {
    setCurrentLesson({ ...lesson, level });
    setChatMessages([
      { 
        role: 'assistant', 
        content: `Hi! Let's practice "${lesson.title}"! 你好！我們來練習「${lesson.title}」吧！\n\nToday we'll focus on: ${lesson.topics.join(', ')}\n\nLet's start with a simple conversation. Try introducing yourself or asking me a question! 試著自我介紹或問我一個問題！` 
      }
    ]);
    setCurrentView('lesson');
  };

  // Render home view
  const renderHome = () => (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="sparkle-icon">
            <Sparkles size={48} />
          </div>
          <h1 className="app-title">AI English Master</h1>
          <p className="app-subtitle">AI 互動式英語學習平台</p>
          <div className="level-badge">
            <Trophy size={24} />
            <span>Level {userProfile.level}</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-container">
        <div className="stat-card">
          <Zap className="stat-icon" />
          <div className="stat-value">{userProfile.totalXP}</div>
          <div className="stat-label">Total XP</div>
        </div>
        <div className="stat-card">
          <Star className="stat-icon" />
          <div className="stat-value">{userProfile.streak}</div>
          <div className="stat-label">連續天數</div>
        </div>
        <div className="stat-card">
          <Award className="stat-icon" />
          <div className="stat-value">{userProfile.completedLessons.length}</div>
          <div className="stat-label">完成關卡</div>
        </div>
      </div>

      {/* XP Progress */}
      <div className="xp-progress-container">
        <div className="xp-info">
          <span>Level {userProfile.level}</span>
          <span>{Math.round(getProgressToNextLevel())}%</span>
        </div>
        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${getProgressToNextLevel()}%` }} />
        </div>
        <div className="xp-target">Next level: {getXPForLevel(userProfile.level)} XP</div>
      </div>

      {/* Learning Path */}
      <div className="learning-path">
        <h2 className="section-title">
          <TrendingUp size={24} />
          學習路徑
        </h2>

        {Object.entries(learningPath).map(([key, path]) => (
          <div key={key} className="path-section">
            <div className="path-header" style={{ backgroundColor: path.color }}>
              <h3>{path.title}</h3>
            </div>
            <div className="lessons-grid">
              {path.lessons.map(lesson => {
                const isCompleted = userProfile.completedLessons.includes(lesson.id);
                const isLocked = lesson.id !== path.lessons[0].id && 
                                !userProfile.completedLessons.includes(path.lessons[path.lessons.findIndex(l => l.id === lesson.id) - 1]?.id);

                return (
                  <div 
                    key={lesson.id} 
                    className={`lesson-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
                    onClick={() => !isLocked && startLesson(lesson, key)}
                  >
                    <div className="lesson-icon">
                      {lesson.type === 'conversation' && <MessageCircle size={24} />}
                      {lesson.type === 'vocabulary' && <Book size={24} />}
                      {lesson.type === 'listening' && <Headphones size={24} />}
                      {lesson.type === 'pronunciation' && <Mic size={24} />}
                      {lesson.type === 'news' && <Newspaper size={24} />}
                      {lesson.type === 'media' && <Film size={24} />}
                      {lesson.type === 'reading' && <Globe size={24} />}
                      {lesson.type === 'writing' && <Book size={24} />}
                    </div>
                    <div className="lesson-content">
                      <h4>{lesson.title}</h4>
                      <div className="lesson-xp">
                        <Zap size={14} />
                        {lesson.xp} XP
                      </div>
                    </div>
                    {isCompleted && (
                      <div className="completion-badge">
                        <Check size={20} />
                      </div>
                    )}
                    {!isLocked && !isCompleted && (
                      <ChevronRight className="lesson-arrow" size={20} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="action-btn primary" onClick={() => setCurrentView('freeChat')}>
          <MessageCircle size={20} />
          自由對話練習
        </button>
        <button className="action-btn" onClick={() => setCurrentView('pronunciation')}>
          <Mic size={20} />
          發音測試
        </button>
      </div>
    </div>
  );

  // Render lesson view
  const renderLesson = () => (
    <div className="lesson-view">
      <div className="lesson-header">
        <button className="back-btn" onClick={() => setCurrentView('home')}>
          ← 返回
        </button>
        <div className="lesson-info">
          <h2>{currentLesson.title}</h2>
          <div className="lesson-topics">
            {currentLesson.topics.map((topic, i) => (
              <span key={i} className="topic-tag">{topic}</span>
            ))}
          </div>
        </div>
        <button 
          className="complete-btn"
          onClick={() => {
            completeLesson(currentLesson.id, currentLesson.xp);
            setCurrentView('home');
          }}
        >
          完成課程
        </button>
      </div>

      <div className="chat-container">
        <div className="messages">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="message-content">
                {msg.content}
                {msg.role === 'assistant' && (
                  <button 
                    className="speak-btn"
                    onClick={() => speakText(msg.content)}
                    title="朗讀"
                  >
                    <Volume2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant loading">
              <div className="loading-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="input-area">
          {speechFeedback && (
            <div className="speech-feedback">
              <div className="feedback-header">
                <Mic size={16} />
                發音評分: {speechFeedback.score}/100
              </div>
              <div className="feedback-text">{speechFeedback.text}</div>
            </div>
          )}
          
          <div className="input-controls">
            <button 
              className={`mic-btn ${isRecording ? 'recording' : ''}`}
              onClick={startSpeechRecognition}
              disabled={isRecording}
            >
              <Mic size={20} />
            </button>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && userInput.trim()) {
                  sendMessageToAI(userInput, currentLesson);
                  setUserInput('');
                }
              }}
              placeholder="輸入訊息或使用語音..."
              disabled={isLoading}
            />
            <button 
              className="send-btn"
              onClick={() => {
                if (userInput.trim()) {
                  sendMessageToAI(userInput, currentLesson);
                  setUserInput('');
                }
              }}
              disabled={isLoading || !userInput.trim()}
            >
              發送
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render free chat view
  const renderFreeChat = () => (
    <div className="lesson-view">
      <div className="lesson-header">
        <button className="back-btn" onClick={() => setCurrentView('home')}>
          ← 返回
        </button>
        <div className="lesson-info">
          <h2>自由對話練習</h2>
          <p>和 AI 進行自然對話，提升英語能力</p>
        </div>
      </div>

      <div className="chat-container">
        <div className="messages">
          {chatMessages.length === 0 && (
            <div className="message assistant">
              <div className="message-content">
                Hi! I'm your AI English conversation partner. Let's chat about anything you'd like! 
                你好！我是你的 AI 英語對話夥伴。我們可以聊任何你想聊的話題！
              </div>
            </div>
          )}
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="message-content">
                {msg.content}
                {msg.role === 'assistant' && (
                  <button 
                    className="speak-btn"
                    onClick={() => speakText(msg.content)}
                    title="朗讀"
                  >
                    <Volume2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant loading">
              <div className="loading-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="input-area">
          {speechFeedback && (
            <div className="speech-feedback">
              <div className="feedback-header">
                <Mic size={16} />
                發音評分: {speechFeedback.score}/100
              </div>
              <div className="feedback-text">{speechFeedback.text}</div>
            </div>
          )}
          
          <div className="input-controls">
            <button 
              className={`mic-btn ${isRecording ? 'recording' : ''}`}
              onClick={startSpeechRecognition}
              disabled={isRecording}
            >
              <Mic size={20} />
            </button>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && userInput.trim()) {
                  sendMessageToAI(userInput, null);
                  setUserInput('');
                }
              }}
              placeholder="輸入訊息或使用語音..."
              disabled={isLoading}
            />
            <button 
              className="send-btn"
              onClick={() => {
                if (userInput.trim()) {
                  sendMessageToAI(userInput, null);
                  setUserInput('');
                }
              }}
              disabled={isLoading || !userInput.trim()}
            >
              發送
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render pronunciation practice view
  const renderPronunciation = () => (
    <div className="pronunciation-view">
      <div className="lesson-header">
        <button className="back-btn" onClick={() => setCurrentView('home')}>
          ← 返回
        </button>
        <div className="lesson-info">
          <h2>發音測試</h2>
          <p>練習英語發音，獲得即時反饋</p>
        </div>
      </div>

      <div className="pronunciation-content">
        <div className="pronunciation-card">
          <Mic size={64} className="large-icon" />
          <h3>點擊麥克風開始錄音</h3>
          <p>說出任何英語句子，系統會評估你的發音</p>
          
          <button 
            className={`record-btn ${isRecording ? 'recording' : ''}`}
            onClick={startSpeechRecognition}
            disabled={isRecording}
          >
            {isRecording ? '正在錄音...' : '開始錄音'}
          </button>

          {speechFeedback && (
            <div className="pronunciation-result">
              <div className="score-display">
                <div className="score-circle" style={{
                  background: `conic-gradient(#10b981 ${speechFeedback.score * 3.6}deg, #e5e7eb 0deg)`
                }}>
                  <div className="score-inner">
                    {speechFeedback.score}
                    <span>分</span>
                  </div>
                </div>
              </div>
              <div className="recognized-text">
                <h4>識別文字：</h4>
                <p>{speechFeedback.text}</p>
              </div>
              {speechFeedback.score >= 80 && (
                <div className="feedback-message success">
                  <Check size={20} />
                  太棒了！發音很標準！
                </div>
              )}
              {speechFeedback.score < 80 && speechFeedback.score >= 60 && (
                <div className="feedback-message warning">
                  不錯！繼續練習會更好！
                </div>
              )}
              {speechFeedback.score < 60 && (
                <div className="feedback-message error">
                  <X size={20} />
                  再試一次，放慢速度清楚發音
                </div>
              )}
            </div>
          )}
        </div>

        <div className="practice-suggestions">
          <h3>練習建議</h3>
          <div className="suggestion-list">
            <div className="suggestion-item" onClick={() => speakText("Hello, how are you today?")}>
              <Volume2 size={20} />
              <div>
                <strong>Hello, how are you today?</strong>
                <p>日常問候</p>
              </div>
            </div>
            <div className="suggestion-item" onClick={() => speakText("I would like to order a coffee, please.")}>
              <Volume2 size={20} />
              <div>
                <strong>I would like to order a coffee, please.</strong>
                <p>點餐用語</p>
              </div>
            </div>
            <div className="suggestion-item" onClick={() => speakText("Thank you very much for your help.")}>
              <Volume2 size={20} />
              <div>
                <strong>Thank you very much for your help.</strong>
                <p>表達感謝</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      {currentView === 'home' && renderHome()}
      {currentView === 'lesson' && renderLesson()}
      {currentView === 'freeChat' && renderFreeChat()}
      {currentView === 'pronunciation' && renderPronunciation()}

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #1f2937;
          padding: 20px;
        }

        /* Home View */
        .home-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-section {
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
          border-radius: 30px;
          padding: 60px 40px;
          text-align: center;
          margin-bottom: 30px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          backdrop-filter: blur(10px);
        }

        .sparkle-icon {
          display: inline-block;
          color: #f59e0b;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .app-title {
          font-size: 48px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 20px 0 10px;
          letter-spacing: -1px;
        }

        .app-subtitle {
          font-size: 20px;
          color: #6b7280;
          margin-bottom: 30px;
        }

        .level-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          padding: 12px 30px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 18px;
          box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);
        }

        .stats-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: rgba(255,255,255,0.95);
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-icon {
          color: #667eea;
          margin-bottom: 15px;
        }

        .stat-value {
          font-size: 36px;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .xp-progress-container {
          background: rgba(255,255,255,0.95);
          border-radius: 20px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .xp-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-weight: 600;
          color: #1f2937;
        }

        .xp-bar {
          height: 20px;
          background: #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .xp-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #059669);
          transition: width 0.5s ease;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }

        .xp-target {
          text-align: right;
          font-size: 14px;
          color: #6b7280;
        }

        .learning-path {
          margin-bottom: 30px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 15px;
          font-size: 28px;
          font-weight: 800;
          color: white;
          margin-bottom: 25px;
        }

        .path-section {
          background: rgba(255,255,255,0.95);
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 25px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .path-header {
          padding: 20px 30px;
          color: white;
          font-weight: 700;
        }

        .path-header h3 {
          font-size: 24px;
          margin: 0;
        }

        .lessons-grid {
          padding: 25px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }

        .lesson-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 15px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .lesson-card:hover:not(.locked) {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          border-color: #667eea;
        }

        .lesson-card.completed {
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          border-color: #10b981;
        }

        .lesson-card.locked {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .lesson-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .lesson-content {
          flex: 1;
        }

        .lesson-content h4 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #1f2937;
        }

        .lesson-xp {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #f59e0b;
          font-weight: 600;
          font-size: 14px;
        }

        .completion-badge {
          width: 30px;
          height: 30px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .lesson-arrow {
          color: #9ca3af;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .action-btn {
          background: rgba(255,255,255,0.95);
          border: 2px solid #e5e7eb;
          border-radius: 15px;
          padding: 20px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #1f2937;
        }

        .action-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
        }

        /* Lesson View */
        .lesson-view {
          max-width: 1000px;
          margin: 0 auto;
          background: rgba(255,255,255,0.95);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          height: calc(100vh - 40px);
        }

        .lesson-header {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 25px 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .back-btn, .complete-btn {
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 10px 20px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .back-btn:hover, .complete-btn:hover {
          background: rgba(255,255,255,0.3);
        }

        .lesson-info h2 {
          margin-bottom: 10px;
        }

        .lesson-topics {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .topic-tag {
          background: rgba(255,255,255,0.2);
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 14px;
        }

        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .message {
          max-width: 70%;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.user {
          align-self: flex-end;
        }

        .message.assistant {
          align-self: flex-start;
        }

        .message-content {
          background: white;
          padding: 15px 20px;
          border-radius: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: relative;
          line-height: 1.6;
        }

        .message.user .message-content {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .speak-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(102, 126, 234, 0.1);
          border: none;
          padding: 5px;
          border-radius: 5px;
          cursor: pointer;
          color: #667eea;
          transition: all 0.2s ease;
        }

        .speak-btn:hover {
          background: rgba(102, 126, 234, 0.2);
        }

        .loading-dots {
          display: flex;
          gap: 5px;
          padding: 10px;
        }

        .loading-dots span {
          width: 8px;
          height: 8px;
          background: #9ca3af;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        .input-area {
          border-top: 1px solid #e5e7eb;
          padding: 20px 30px;
          background: white;
        }

        .speech-feedback {
          background: #f3f4f6;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 15px;
        }

        .feedback-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .feedback-text {
          font-style: italic;
          color: #6b7280;
        }

        .input-controls {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .mic-btn {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border: none;
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .mic-btn:hover {
          transform: scale(1.1);
        }

        .mic-btn.recording {
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
        }

        input {
          flex: 1;
          padding: 15px 20px;
          border: 2px solid #e5e7eb;
          border-radius: 25px;
          font-size: 16px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        input:focus {
          border-color: #667eea;
        }

        .send-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          color: white;
          padding: 15px 30px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .send-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Pronunciation View */
        .pronunciation-view {
          max-width: 1000px;
          margin: 0 auto;
          background: rgba(255,255,255,0.95);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .pronunciation-content {
          padding: 40px;
        }

        .pronunciation-card {
          background: white;
          border-radius: 20px;
          padding: 60px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }

        .large-icon {
          color: #667eea;
          margin-bottom: 20px;
        }

        .record-btn {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border: none;
          color: white;
          padding: 20px 50px;
          border-radius: 50px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 30px;
          transition: all 0.3s ease;
        }

        .record-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
        }

        .record-btn.recording {
          animation: pulse 1s infinite;
        }

        .pronunciation-result {
          margin-top: 40px;
          padding-top: 40px;
          border-top: 2px solid #e5e7eb;
        }

        .score-display {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
        }

        .score-circle {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .score-inner {
          width: 120px;
          height: 120px;
          background: white;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: 800;
          color: #1f2937;
        }

        .score-inner span {
          font-size: 16px;
          font-weight: 600;
          color: #6b7280;
        }

        .recognized-text {
          background: #f3f4f6;
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .recognized-text h4 {
          margin-bottom: 10px;
          color: #1f2937;
        }

        .recognized-text p {
          font-size: 18px;
          font-weight: 500;
          color: #374151;
        }

        .feedback-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 15px;
          border-radius: 10px;
          font-weight: 600;
        }

        .feedback-message.success {
          background: #d1fae5;
          color: #065f46;
        }

        .feedback-message.warning {
          background: #fef3c7;
          color: #92400e;
        }

        .feedback-message.error {
          background: #fee2e2;
          color: #991b1b;
        }

        .practice-suggestions h3 {
          margin-bottom: 20px;
          color: #1f2937;
        }

        .suggestion-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .suggestion-item {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 15px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .suggestion-item:hover {
          border-color: #667eea;
          transform: translateX(5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .suggestion-item strong {
          color: #1f2937;
          display: block;
          margin-bottom: 5px;
        }

        .suggestion-item p {
          color: #6b7280;
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .app {
            padding: 10px;
          }

          .stats-container {
            grid-template-columns: 1fr;
          }

          .lessons-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }

          .message {
            max-width: 85%;
          }

          .app-title {
            font-size: 32px;
          }

          .hero-section {
            padding: 40px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default EnglishLearningApp;
