import { useState } from 'react';
import './App.css';

function App() {
  const [script, setScript] = useState();
  const [selectedTopic, setSelectedTopic] = useState();
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  const handleTopicClick = async (topic) => {
    setScript()
    setIsLoading(true); // Set loading to true before fetching
    setSelectedTopic(topic);
    const message = `${topic?.name}, ${topic?.description}`;

    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: message
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      const response = await fetch('http://localhost:8001/sub-topics', options)
      const data = await response.json();
      const content = data?.choices[0]?.message?.content
      const jsonContent = JSON.parse(content)
      setScript(jsonContent);
      console.log(script)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false); // Set loading to false after fetching (regardless of success/error)
    }
  }

  const handleCall = async () => {
    setScript()
    setMessage()
    setIsLoading(true); // Set loading to true before fetching
    console.log(value)
    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      const response = await fetch('http://localhost:8000/topics', options)
      const data = await response.json();
      const content = data?.choices[0]?.message?.content
      const jsonContent = JSON.parse(content)
      setMessage(jsonContent)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false); // Set loading to false after fetching (regardless of success/error)
    }
  }

  return (
    <div className={`container ${isLoading ? 'loading' : ''} `}>
      <div className='header'>
        <h1>Podcast</h1>
        <div className='header-input'>
          <input value={value} onChange={(e) => setValue(e.target.value)}></input>
          <button onClick={handleCall}> Enter</button>
        </div>
      </div>
      <div className={`all-topics ${isLoading ? 'loading' : ''}`}>
        <div className='left-topics'>
          {message?.topics ? (
            message.topics.map((topic) => (
              <div key={topic.name}
                className={`left-topic-button-and-text ${selectedTopic?.name === topic.name ? 'selected disabled' : ''} ${isLoading ? 'loading' : ''}`}>
                <button onClick={() => handleTopicClick(topic)} className='left-topic-button'>
                  {topic.name}
                </button>
                <p>{topic.description}</p>
              </div>
            ))
          ) : (
            <h1>Topics</h1> // Display "Topics" if message.topics is not valid
          )}
        </div>
        <div className="right-sub-topics">
          {message?.topics ? (
            script?.subtopics.map((subtopic) => (
              <div key={subtopic.subjecttitle} className='sub-topic-container'>
                <h2>{subtopic.subjecttitle}</h2>
                <p>{subtopic.subjectconversation}</p>
              </div>
            ))
          ) : (
            <h1>Sub-Topics</h1> // Display "Topics" if message.topics is not valid
          )}
        </div>
      </div>
    </div>
  );
}


export default App;
