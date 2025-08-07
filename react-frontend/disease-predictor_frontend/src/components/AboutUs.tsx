import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Brain, Target, Users, Award, Shield, ArrowLeft } from 'lucide-react';

const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Accuracy",
      description: "We strive for the highest accuracy in our AI predictions using state-of-the-art machine learning algorithms."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Privacy",
      description: "Your health data is secure and private. We follow strict data protection protocols and never share personal information."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Accessibility",
      description: "Making advanced healthcare predictions accessible to everyone, regardless of location or economic status."
    },
    {
      icon: <Award className="w-8 h-8 text-orange-600" />,
      title: "Innovation",
      description: "Continuously improving our AI models and expanding our disease prediction capabilities."
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      description: "15+ years in preventive medicine and AI healthcare applications",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Dr. Michael Chen",
      role: "Lead AI Researcher",
      description: "PhD in Machine Learning with focus on medical diagnostics",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Data Science Director",
      description: "Expert in biostatistics and healthcare data analysis",
      image: "https://images.unsplash.com/photo-1594824388853-d0c2b7b5e6b7?w=300&h=300&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <div className="flex items-center">
                <Heart className="w-8 h-8 text-blue-600 mr-2" />
                <span className="text-2xl font-bold text-gray-800">MediPredict</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 text-sm font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            About <span className="text-blue-600">DiagNO-AI</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We're on a mission to revolutionize healthcare through artificial intelligence, 
            making early disease detection accessible to everyone, everywhere.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At MediPredict, we believe that early detection saves lives. Our advanced AI platform 
                analyzes health data to predict the risk of serious diseases like diabetes, heart disease, 
                stroke, and Parkinson's disease.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                By leveraging cutting-edge machine learning algorithms trained on vast medical datasets, 
                we provide accurate, instant health assessments that empower individuals to take 
                proactive steps toward better health.
              </p>
              <div className="flex items-center text-blue-600">
                <Brain className="w-6 h-6 mr-2" />
                <span className="font-semibold">Powered by Advanced AI Technology</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">95%+</div>
                  <div className="text-gray-700">Prediction Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
                  <div className="text-gray-700">Users Served</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">4</div>
                  <div className="text-gray-700">Disease Types</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                  <div className="text-gray-700">Availability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do at MediPredict
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team of medical experts and AI researchers are dedicated to advancing healthcare through technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-teal-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Technology</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on cutting-edge AI and machine learning technologies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Advanced Machine Learning</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">XGBoost and Random Forest algorithms for high accuracy</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Trained on large-scale medical datasets</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-100 rounded-full p-1 mr-3 mt-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Continuous model improvement and validation</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-orange-100 rounded-full p-1 mr-3 mt-1">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Real-time prediction processing</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Prediction Accuracy</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Diabetes</span>
                    <span className="text-sm text-gray-600">96%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '96%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Heart Disease</span>
                    <span className="text-sm text-gray-600">94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{width: '94%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Stroke</span>
                    <span className="text-sm text-gray-600">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '95%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Parkinson's</span>
                    <span className="text-sm text-gray-600">97%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '97%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Join the Future of Healthcare
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Experience the power of AI-driven health predictions today
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
