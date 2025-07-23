import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import CaptureImage from './assets/components/CaptureImage';
import Flashcards from './assets/components/Flashcards';
import AboutUs from './assets/components/AboutUs';
import Footer from './assets/components/Footer';

function App() {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null); // New state for captured image
  const [predictionResult, setPredictionResult] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const uploadRef = useRef(null);
  const fileInputRef = useRef(null);
  const fadeInRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setShowUpload(true);
            }, 500);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (uploadRef.current) {
      observer.observe(uploadRef.current);
    }

    return () => {
      if (uploadRef.current) {
        observer.unobserve(uploadRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (fadeInRef.current) {
      fadeObserver.observe(fadeInRef.current);
    }

    return () => {
      if (fadeInRef.current) {
        fadeObserver.unobserve(fadeInRef.current);
      }
    };
  }, []);

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setCapturedImage(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
    }
  };
  const handleCaptureImage = (imageDataUrl) => {
    setImagePreview(null)
    setCapturedImage(imageDataUrl);
    setSelectedFile(null); // Clear uploaded file
    setImagePreview(imageDataUrl);
  };

  const handlePredict = async () => {
    const imageToSend = capturedImage || selectedFile;
    if (!imageToSend) {
      alert('Please capture or upload an image first.');
      return;
    }

    const formData = new FormData();

    if (capturedImage) {
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      formData.append('file', blob, 'captured_image.jpg');
    } else {
      formData.append('file', selectedFile);
    }
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPredictionResult(`Prediction: ${data.predicted_class}\nConfidence: ${data.confidence}\nPesticide: ${data.pesticide}`);
      } else {
        setPredictionResult('Prediction failed. Please try again.');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      setPredictionResult('Failed to connect to backend.');
    }
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <header className="header">
          <h1 className="header-title">CropScan</h1>
          <nav>
            <ul className="nav-list">
              <li>
                <button className="nav-link" onClick={() => handleScroll('home')}>
                  Home
                </button>
              </li>
              <li>
                <button className="nav-link" onClick={() => handleScroll('upload')}>
                  Upload
                </button>
              </li>
              <li>
                <button className="nav-link" onClick={() => handleScroll('FAQ')}>
                  FAQ'S
                </button>
              </li>
              <li>
                <button className="nav-link" onClick={() => handleScroll('about')}>
                  About Us
                </button>
              </li>
              <li>
                <button className="nav-link" onClick={() => handleScroll('Contact Us')}>
                  Contact Us
                </button>
              </li>
              
              
            </ul>
          </nav>
        </header>

        <section id="home" className="hero-section">
          <div className="tagline gap-2 sm:p-6 md:p-8 lg:p-10 xl:p-12">Empowering Agriculture with AI</div>
          <div className="blurred-text pb-2 px-10 text-center">
            <h2 className="hero-title">Detect Plant Diseases Easily</h2>
            <p className="hero-text">
              Upload your plant image and get instant disease detection and information.
            </p>
            <button className="hero-button" onClick={() => handleScroll('upload')}>
              Get Started
            </button>
          </div>
        </section>

        <section id="upload" ref={uploadRef} className="upload-section">
          {showUpload && (
            <div ref={fadeInRef}>
            <h2 className="upload-title">Upload Your Plant Image</h2>
            
            <div className="flex justify-center items-center gap-4 pb-4 w-full">
              <button className="upload upload-bg flex items-center gap-2" onClick={handleUploadClick}>
                Upload Here <i className="fa-solid fa-cloud-arrow-up"></i></button>
                <div className="upload upload-bg image-preview-container">
                  <CaptureImage onCapture={handleCaptureImage} />
                </div>
            </div>

                <input
                  type="file"
                  className="upload-input"
                  onChange={handleFileSelect}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
              {imagePreview && (
                <div className="image-preview-container">
                  <img
                    src={imagePreview}
                    alt="Centered Image"
                    className="image-preview"
                  />
                </div>
              )}
              <button className="upload-button mb-6" onClick={handlePredict}>Detect Disease</button>
              {predictionResult && 
              <div className="prediction-result">
              {predictionResult.split('\n').map((line, index) => {
                const [label, value] = line.split(':');
                return (
                  <div key={index}>
                    <strong>{label}: {value.trim()}</strong>
                  </div>
                  
                );
              })}
            </div>
              }
              <Flashcards />
            </div>
          )}
        </section>

      </div>

      <div className="py-4 pb-4">
        <AboutUs />
      </div>
      <div>
        <Footer />
      </div>

      <div className="p-4 text-center text-white">CopyRight @2025</div>
    </div>
  );
}

export default App;