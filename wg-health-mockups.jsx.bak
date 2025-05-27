import React, { useState } from 'react';

const WGHealthMockups = () => {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [role, setRole] = useState(null);
  
  const goToNextScreen = () => {
    setCurrentScreen(prev => prev + 1);
  };
  
  const goToPrevScreen = () => {
    setCurrentScreen(prev => prev - 1);
  };
  
  const selectRole = (selectedRole) => {
    setRole(selectedRole);
  };
  
  const screens = {
    1: <WelcomeScreen onNext={goToNextScreen} />,
    2: <RoleSelectionScreen onNext={goToNextScreen} onBack={goToPrevScreen} onSelectRole={selectRole} />,
    3: <ProfileSetupScreen onNext={goToNextScreen} onBack={goToPrevScreen} />,
    4: <PrivacyDataScreen onNext={goToNextScreen} onBack={goToPrevScreen} role={role} />,
    5: role === 'caretaker' ? 
       <ConnectionSetupScreen onNext={goToNextScreen} onBack={goToPrevScreen} /> : 
       <DailyTrackingScreen onNext={goToNextScreen} onBack={goToPrevScreen} />,
    6: role === 'caretaker' ? 
       <DailyTrackingScreen onNext={goToNextScreen} onBack={goToPrevScreen} /> : 
       <SuccessScreen onFinish={() => {}} onBack={goToPrevScreen} />,
    7: role === 'caretaker' ? 
       <SuccessScreen onFinish={() => {}} onBack={goToPrevScreen} /> : 
       null
  };
  
  return (
    <div className="bg-gray-100 min-h-screen p-4 flex justify-center">
      <div className="max-w-md w-full">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-700">WG Health App Mockups</h2>
          <div className="text-sm text-gray-500">Screen {currentScreen} of {role === 'caretaker' ? 7 : 6}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
          {screens[currentScreen]}
        </div>
        
        <div className="text-sm text-gray-500 mt-2">
          Note: These mockups demonstrate layout and content. Final app would include more polish, animations, and device-specific optimizations.
        </div>
      </div>
    </div>
  );
};

const WelcomeScreen = ({ onNext }) => {
  return (
    <div className="p-6 flex flex-col items-center text-center">
      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to WG Health</h1>
      <p className="text-xl text-gray-600 mb-6">Your friendly companion for daily health tracking</p>
      
      <p className="text-lg text-gray-600 mb-8">
        WG Health helps you keep track of your health activities and stay connected with your loved ones. Everything is simple, secure, and designed with your needs in mind.
      </p>
      
      <button 
        onClick={onNext}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl font-semibold py-4 px-6 rounded-lg mb-4 transition duration-300">
        Start Here
      </button>
      
      <p className="text-base text-gray-500 mb-4">
        This takes about 5 minutes. You can pause and come back anytime.
      </p>
      
      <p className="text-base text-gray-600 font-semibold">
        No technical knowledge needed. We guide you through each step.
      </p>
    </div>
  );
};

const RoleSelectionScreen = ({ onNext, onBack, onSelectRole }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Tell us who you are</h1>
      
      <div className="space-y-4 mb-8">
        <div 
          onClick={() => onSelectRole('senior')}
          className="border-2 border-gray-200 hover:border-blue-500 p-4 rounded-lg cursor-pointer transition duration-300 flex items-center"
        >
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">I'm using this for myself</h3>
            <p className="text-gray-600">I want to keep track of my health and daily activities</p>
          </div>
        </div>
        
        <div 
          onClick={() => onSelectRole('caretaker')}
          className="border-2 border-gray-200 hover:border-blue-500 p-4 rounded-lg cursor-pointer transition duration-300 flex items-center"
        >
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">I'm helping someone else</h3>
            <p className="text-gray-600">I help care for a family member or friend and want to stay connected</p>
          </div>
        </div>
      </div>
      
      <p className="text-center text-gray-600 mb-8">
        This choice can be changed later in Settings if needed.
      </p>
      
      <div className="flex justify-between">
        <button 
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300">
          Back
        </button>
        <button 
          onClick={onNext}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
          Continue
        </button>
      </div>
    </div>
  );
};

const ProfileSetupScreen = ({ onNext, onBack }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Let's create your profile</h1>
      
      <div className="mb-6">
        <label className="block text-xl text-gray-700 mb-2" htmlFor="name">
          Your name
        </label>
        <input 
          type="text" 
          id="name"
          className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" 
          placeholder="Enter your name here"
        />
        <p className="text-gray-500 mt-2">This is how you'll be seen in the app</p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl text-gray-700 mb-2">Add your photo (optional)</h3>
        <p className="text-gray-500 mb-4">
          A photo makes it easier for others to recognize you. Many people choose to add a simple smiling photo.
        </p>
        
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          <div className="flex flex-col gap-2">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
              Select a photo
            </button>
            <button className="text-blue-500 hover:text-blue-700 font-semibold">
              I'll do this later
            </button>
          </div>
        </div>
      </div>
      
      <p className="text-center text-gray-600 mb-8">
        You can always update your profile information later.
      </p>
      
      <div className="flex justify-between">
        <button 
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300">
          Back
        </button>
        <button 
          onClick={onNext}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
          Continue
        </button>
      </div>
    </div>
  );
};

const PrivacyDataScreen = ({ onNext, onBack, role }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">We understand privacy concerns</h1>
      <p className="text-xl text-gray-600 mb-6 text-center">Your information is safe with us</p>
      
      <div className="space-y-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Your Information Stays Private</h3>
          <p className="text-gray-600">
            Your health details are stored securely and only shared with people you specifically choose. (You can change this anytime)
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">No Selling of Your Information</h3>
          <p className="text-gray-600">
            We never sell your personal details to other companies or use them for advertising.
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">You're Always in Control</h3>
          <p className="text-gray-600">
            You decide who can see your information, and you can change your mind anytime.
          </p>
        </div>
      </div>
      
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
        <p className="text-gray-700">
          <strong>Important note:</strong> We designed this app with strict privacy rules. Your doctor won't see this data unless you specifically show them.
        </p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {role === 'senior' ? 'Your permission settings:' : 'Your caretaker agreement:'}
        </h3>
        
        {role === 'senior' ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <input type="checkbox" id="permission1" className="mt-1 w-5 h-5" />
              <label htmlFor="permission1" className="text-gray-700">
                I allow my caretaker to see my daily activities (You can change this anytime)
              </label>
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="permission2" className="mt-1 w-5 h-5" />
              <label htmlFor="permission2" className="text-gray-700">
                I allow my caretaker to receive notices about my activity (You can change this anytime)
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <input type="checkbox" id="agreement1" className="mt-1 w-5 h-5" />
              <label htmlFor="agreement1" className="text-gray-700">
                I will respect the privacy choices made by the person I care for
              </label>
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="agreement2" className="mt-1 w-5 h-5" />
              <label htmlFor="agreement2" className="text-gray-700">
                I understand I will only see information they've chosen to share with me
              </label>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <button 
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300">
          Back
        </button>
        <button 
          onClick={onNext}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
          Continue
        </button>
      </div>
    </div>
  );
};

const ConnectionSetupScreen = ({ onNext, onBack }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Connect with your loved one</h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
        To receive updates from the person you care for, you'll need to connect your accounts. This is easy to do.
      </p>
      
      <div className="space-y-4 mb-6">
        <div className="border border-gray-200 p-4 rounded-lg hover:border-blue-300 cursor-pointer transition duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-lg text-gray-700">Send an invitation by email</span>
          </div>
        </div>
        
        <div className="border border-gray-200 p-4 rounded-lg hover:border-blue-300 cursor-pointer transition duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-lg text-gray-700">Send an invitation by text message</span>
          </div>
        </div>
        
        <div className="border border-gray-200 p-4 rounded-lg hover:border-blue-300 cursor-pointer transition duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <span className="text-lg text-gray-700">Use a connection code</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-8">
        <p className="text-gray-700 mb-2">
          <strong>Connection code helper:</strong> If you're together right now, ask them to share their connection code from their Settings screen.
        </p>
        <p className="text-gray-700">
          A connection code looks like: <span className="font-mono bg-white px-2 py-1 rounded">WGH-1234</span>
        </p>
      </div>
      
      <p className="text-center text-gray-600 mb-8">
        Don't worry if you're not ready to connect now. Many people set this up later from the Home screen.
      </p>
      
      <div className="flex justify-between">
        <button 
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300">
          Back
        </button>
        <button 
          onClick={onNext}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
          Continue
        </button>
      </div>
    </div>
  );
};

const DailyTrackingScreen = ({ onNext, onBack }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Easy Health Tracking</h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
        Keep track of important health activities with just a few simple presses.
      </p>
      
      <div className="space-y-5 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Medications</h3>
          </div>
          <p className="text-gray-600 ml-11">
            Record when you take your medications and set helpful reminders. For example, track when you take your heart medication.
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Daily Activities</h3>
          </div>
          <p className="text-gray-600 ml-11">
            Keep track of meals, walks, and time spent with others. For example, log your morning walk.
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">How You're Feeling</h3>
          </div>
          <p className="text-gray-600 ml-11">
            Note your daily mood and comfort level using simple options. For example, record if you're feeling energetic or tired.
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Health Notes</h3>
          </div>
          <p className="text-gray-600 ml-11">
            Write down questions or concerns for your next doctor visit. For example, note any new symptoms.
          </p>
        </div>
      </div>
      
      <p className="text-center text-gray-600 mb-4">
        <strong>Nothing happens automatically</strong> - you control when to record information.
      </p>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <p className="text-gray-700">
          Everything in this app has large, readable text and easy-to-press buttons. You can also use voice commands if pressing buttons is difficult.
        </p>
      </div>
      
      <div className="text-center mb-6">
        <p className="text-gray-600 mb-2">
          Don't worry - you can adjust any of these settings later in your profile
        </p>
      </div>
      
      <div className="flex justify-between">
        <button 
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300">
          Back
        </button>
        <button 
          onClick={onNext}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
          Finish
        </button>
      </div>
    </div>
  );
};

const SuccessScreen = ({ onFinish, onBack }) => {
  return (
    <div className="p-6 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Congratulations! You're All Set!</h1>
      <p className="text-xl text-gray-600 mb-6">
        Your WG Health app is ready to use. We're here to help you stay healthy and connected with those who care about you.
      </p>
      
      <p className="text-lg text-gray-700 mb-8">
        Many people explore just one feature at a time. There's no rush to use everything at once.
      </p>
      
      <button 
        onClick={onFinish}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl font-semibold py-4 px-6 rounded-lg mb-6 transition duration-300">
        Go to My Home Screen
      </button>
      
      <p className="text-lg text-gray-600 mb-4">
        Questions or need help? Press <strong>Help</strong> anytime and we'll guide you through any questions
      </p>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-lg text-gray-700">
          Is this text easy to read? You can make it larger in Settings if needed.
        </p>
      </div>
      
      <div className="mt-8">
        <button 
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300">
          Back
        </button>
      </div>
    </div>
  );
};

export default WGHealthMockups;