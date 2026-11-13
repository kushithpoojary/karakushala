import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { STORY_TEMPLATES } from '../data/mockData';
import { Camera, Image as ImageIcon, Sparkles, ArrowRight, ArrowLeft, Check, Clock, Layers, MapPin, IndianRupee, Mic, MicOff, Volume2, HelpCircle } from 'lucide-react';

export default function GuidedListingForm({ onProductCreated }) {
  const { activeArtisan, showToast, formatINR } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Photo
  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80');
  const [imageFile, setImageFile] = useState(null);

  // Step 2: Craft Details
  const [craftType, setCraftType] = useState('Kasuti Embroidery');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('2400');
  const [stockQuantity, setStockQuantity] = useState('5');

  // Step 3: Story Prompt
  const [hoursSpent, setHoursSpent] = useState('32');
  const [materialsUsed, setMaterialsUsed] = useState('Pure mulberry silk threads and handloom Ilkal khadi');
  const [culturalSignificance, setCulturalSignificance] = useState('Sacred temple Gopuram motif hand-stitched by thread-counting');
  const [provenanceLocation, setProvenanceLocation] = useState(activeArtisan.village || 'Navalgund, Dharwad, Karnataka');

  // Audio speech recognition state for input fields
  const [listeningField, setListeningField] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Indian English handles regional pronunciation smoothly

      recognition.onresult = (event) => {
        const rawTranscript = event.results[0][0].transcript;
        if (!rawTranscript) return;

        const clean = rawTranscript.trim();
        handleVoiceInputResult(clean);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error in listing form:', event.error);
        setListeningField(null);
        if (event.error === 'not-allowed') {
          showToast('Microphone access denied. Please allow microphone in browser.', 'warning');
        } else if (event.error === 'no-speech') {
          showToast('No speech detected. Please speak into the mic.', 'info');
        }
      };

      recognition.onend = () => {
        setListeningField(null);
      };

      recognitionRef.current = recognition;
    }
  }, [listeningField]);

  // Number parser for spoken prices and numbers
  const parseNumberFromSpeech = (text) => {
    const directDigits = text.replace(/[^0-9]/g, '');
    if (directDigits) return directDigits;

    const words = text.toLowerCase().split(/\s+/);
    const wordMap = {
      'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
      'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15, 'twenty': 20, 'thirty': 30,
      'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
      'hundred': 100, 'thousand': 1000, 'lakh': 100000
    };

    let total = 0;
    let current = 0;
    for (const w of words) {
      if (wordMap[w] !== undefined) {
        const val = wordMap[w];
        if (val === 100) {
          current = (current || 1) * 100;
        } else if (val === 1000) {
          total += (current || 1) * 1000;
          current = 0;
        } else {
          current += val;
        }
      }
    }
    total += current;
    return total > 0 ? total.toString() : text;
  };

  const handleVoiceInputResult = (clean) => {
    const field = listeningField;
    setListeningField(null);

    let recordedValue = clean;

    switch (field) {
      case 'title':
        setTitle(clean);
        break;
      case 'craftType':
        if (clean.toLowerCase().includes('kasuti') || clean.toLowerCase().includes('embroid')) {
          setCraftType('Kasuti Embroidery');
          recordedValue = 'Kasuti Embroidery';
        } else if (clean.toLowerCase().includes('beedu') || clean.toLowerCase().includes('cane') || clean.toLowerCase().includes('palm')) {
          setCraftType('Beedu Craft');
          recordedValue = 'Beedu Craft';
        } else if (clean.toLowerCase().includes('coastal') || clean.toLowerCase().includes('wood') || clean.toLowerCase().includes('shell') || clean.toLowerCase().includes('diya')) {
          setCraftType('Coastal Wood & Shell');
          recordedValue = 'Coastal Wood & Shell';
        }
        break;
      case 'price':
        const parsedPrice = parseNumberFromSpeech(clean);
        setPrice(parsedPrice);
        recordedValue = `₹${parsedPrice}`;
        break;
      case 'stockQuantity':
        const parsedStock = parseNumberFromSpeech(clean);
        setStockQuantity(parsedStock);
        recordedValue = `${parsedStock} units`;
        break;
      case 'hoursSpent':
        const parsedHours = parseNumberFromSpeech(clean);
        setHoursSpent(parsedHours);
        recordedValue = `${parsedHours} hours`;
        break;
      case 'provenanceLocation':
        setProvenanceLocation(clean);
        break;
      case 'materialsUsed':
        setMaterialsUsed(clean);
        break;
      case 'culturalSignificance':
        setCulturalSignificance(clean);
        break;
      default:
        break;
    }

    showToast(`🎙️ Voice Recorded for ${field}: "${recordedValue}"`, 'success');

    // Audio feedback announcement
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(`Recorded ${recordedValue}`);
      u.rate = 1.0;
      window.speechSynthesis.speak(u);
    }
  };

  const startVoiceInput = (fieldName, fieldLabelKannada) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Speech Recognition not supported in this browser. Please try Chrome, Edge, or Safari.', 'warning');
      return;
    }

    if (listeningField === fieldName) {
      recognitionRef.current?.stop();
      setListeningField(null);
      return;
    }

    setListeningField(fieldName);
    showToast(`🎙️ Listening for ${fieldName} (${fieldLabelKannada})... ಮಾತನಾಡಿ`, 'info');

    try {
      recognitionRef.current?.start();
    } catch (err) {
      console.warn('Recognition start exception:', err);
    }
  };

  // Sample quick images for easy demo
  const sampleImages = [
    { label: 'Kasuti Saree/Textile', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Kasuti Tapestry', url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80' },
    { label: 'Beedu Palm Chest', url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=800&q=80' },
    { label: 'Beedu Cane Lamp', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80' },
    { label: 'Coastal Diya/Wood', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyTemplate = (tmpl) => {
    setCraftType(tmpl.craft);
    setHoursSpent(tmpl.hoursSpent.toString());
    setMaterialsUsed(tmpl.materials);
    setCulturalSignificance(tmpl.significance);
    setProvenanceLocation(tmpl.provenance);
    if (!title) {
      setTitle(`${tmpl.craft} - ${tmpl.templateTitle}`);
    }
    showToast(`Applied ${tmpl.templateTitle} template!`, 'info');
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!imagePreview) {
        showToast('Please select or upload a photo of your craft', 'warning');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!title.trim() || !price) {
        showToast('Please enter the craft title and price', 'warning');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        artisanId: activeArtisan.id,
        title: title.trim(),
        category: craftType,
        price: Number(price),
        stockQuantity: Number(stockQuantity) || 5,
        imageUrl: imagePreview,
        craftStory: {
          hoursSpent: Number(hoursSpent) || 24,
          materialsUsed: materialsUsed.trim(),
          culturalSignificance: culturalSignificance.trim(),
          provenanceLocation: provenanceLocation.trim()
        }
      };

      const created = await api.createProduct(payload);
      showToast('🎉 Your craft has been listed on KaraKushala!', 'success');
      
      // Reset form
      setCurrentStep(1);
      setTitle('');
      if (onProductCreated) onProductCreated(created);
    } catch (err) {
      showToast(err.message || 'Failed to list craft', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper component for Audio Input Button
  const VoiceInputButton = ({ fieldKey, fieldLabelKn, sampleText }) => {
    const isThisActive = listeningField === fieldKey;

    return (
      <button
        type="button"
        onClick={() => startVoiceInput(fieldKey, fieldLabelKn)}
        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
          isThisActive
            ? 'bg-red-600 text-white animate-bounce ring-2 ring-red-400'
            : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
        }`}
        title={`Click to speak ${fieldKey} in Kannada/English (ಧ್ವನಿ ಮೂಲಕ ಭರ್ತಿ)`}
      >
        {isThisActive ? (
          <>
            <MicOff className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-[11px]">Listening (ಮಾತನಾಡಿ)...</span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-[11px]">Voice (ಧ್ವನಿ)</span>
          </>
        )}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-cream-300 shadow-earth p-5 sm:p-8">
      
      {/* 3-Step Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-bold text-terracotta-600 uppercase tracking-wider">
              ಹಂತ {currentStep} / 3 • Voice-Enabled Artisan Listing
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-indigo-900 mt-0.5">
              {currentStep === 1 && "Step 1: Upload Photo (ಚಿತ್ರ ಹಾಕಿ)"}
              {currentStep === 2 && "Step 2: Craft Details & Price (ಬೆಲೆ ಮತ್ತು ವಿವರ)"}
              {currentStep === 3 && "Step 3: Tell Your Craft Story (ಕಲೆಯ ಕಥೆ)"}
            </h3>
          </div>

          <span className="text-3xl select-none">
            {currentStep === 1 && "📸"}
            {currentStep === 2 && "🏷️"}
            {currentStep === 3 && "📜"}
          </span>
        </div>

        {/* Global Voice Input Assistance Banner */}
        <div className="p-3 bg-amber-50/90 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-3 text-xs text-amber-950 mb-4">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>ಧ್ವನಿ ಇನ್ಪುಟ್ ಸಕ್ರಿಯವಾಗಿದೆ (Voice Input Active):</strong> Tap the <strong>"Voice (ಧ್ವನಿ)"</strong> button on any field to speak instead of typing!
            </span>
          </div>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full shrink-0">
            Audio Enabled 🎙️
          </span>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="grid grid-cols-3 gap-2">
          <div className={`h-2 rounded-full transition-all ${currentStep >= 1 ? 'bg-terracotta-600' : 'bg-cream-300'}`} />
          <div className={`h-2 rounded-full transition-all ${currentStep >= 2 ? 'bg-terracotta-600' : 'bg-cream-300'}`} />
          <div className={`h-2 rounded-full transition-all ${currentStep >= 3 ? 'bg-terracotta-600' : 'bg-cream-300'}`} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ================= STEP 1: UPLOAD PHOTO ================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Main Upload / Camera Target */}
            <div className="border-3 border-dashed border-terracotta-300 hover:border-terracotta-500 rounded-3xl p-6 sm:p-8 text-center bg-cream-50 transition-all flex flex-col items-center justify-center relative cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />

              {imagePreview ? (
                <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden shadow-md border-2 border-white">
                  <img src={imagePreview} alt="Craft Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2">
                    <Camera className="w-5 h-5" />
                    <span>Change Photo (ಚಿತ್ರ ಬದಲಾಯಿಸಿ)</span>
                  </div>
                </div>
              ) : (
                <div className="py-8 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-terracotta-100 text-terracotta-700 flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 text-base">Tap here to Take or Upload Photo</p>
                    <p className="text-xs text-stone-500 mt-1">ಫೋಟೋ ತೆಗೆಯಿರಿ ಅಥವಾ ಗ್ಯಾಲರಿಯಿಂದ ಆಯ್ಕೆಮಾಡಿ</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Helper Photo Presets (for zero-friction demo) */}
            <div>
              <p className="text-xs font-semibold text-stone-700 mb-2">
                Or select a sample authentic Karnataka craft image:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {sampleImages.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImagePreview(s.url)}
                    className={`p-1.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      imagePreview === s.url
                        ? 'border-terracotta-600 bg-terracotta-50 ring-2 ring-terracotta-600/30'
                        : 'border-cream-300 bg-white hover:bg-cream-100'
                    }`}
                  >
                    <img src={s.url} alt={s.label} className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-[11px] font-medium text-stone-800 truncate">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Helpful Artisan Tip */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <p>
                <strong>Artisan Tip:</strong> Photograph your craft in natural daylight against a clean, flat surface to highlight intricate needlework and cane textures.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNext}
                className="py-3.5 px-6 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm shadow-md flex items-center gap-2 active:scale-95 touch-target"
              >
                <span>Continue to Step 2 (ಮುಂದೆ)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: CRAFT TYPE & PRICE ================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* 1. Craft Specialty Pill Selector with Voice input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  1. Select Craft Type (ಕಲಾ ಪ್ರಕಾರ)
                </label>
                <VoiceInputButton
                  fieldKey="craftType"
                  fieldLabelKn="ಕಲಾ ಪ್ರಕಾರ"
                  sampleText="Kasuti, Beedu, or Coastal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'Kasuti Embroidery', label: 'Kasuti Embroidery', desc: 'Dharwad needlework (ಕಸೂತಿ)' },
                  { id: 'Beedu Craft', label: 'Beedu Craft', desc: 'Udupi palm-lattice weave (ಬೀಡು)' },
                  { id: 'Coastal Wood & Shell', label: 'Coastal Wood & Shell', desc: 'Karavali carved crafts (ಕರಾವಳಿ)' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCraftType(item.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all touch-target ${
                      craftType === item.id
                        ? 'border-terracotta-600 bg-terracotta-50/80 shadow-sm ring-2 ring-terracotta-600/20'
                        : 'border-cream-300 bg-white hover:bg-cream-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-stone-900">{item.label}</strong>
                      {craftType === item.id && <Check className="w-4 h-4 text-terracotta-600" />}
                    </div>
                    <p className="text-xs text-stone-500 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Product Title with Voice input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  2. Craft Title / Name (ಹೆಸರು)
                </label>
                <VoiceInputButton
                  fieldKey="title"
                  fieldLabelKn="ಹೆಸರು"
                  sampleText="e.g. Kasuti Lotus Saree"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasuti Lotus Motif Ilkal Stole (or speak using mic)"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className={`w-full bg-cream-50 border rounded-xl px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 transition-all ${
                    listeningField === 'title' ? 'border-red-500 bg-red-50/30 ring-2 ring-red-400' : 'border-cream-300'
                  }`}
                />
                {listeningField === 'title' && (
                  <span className="absolute right-3 top-3 text-xs text-red-600 font-bold animate-pulse">
                    Listening...
                  </span>
                )}
              </div>
            </div>

            {/* 3. Price in ₹ & Quantity with Voice Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Price */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    3. Price in ₹ (ಬೆಲೆ)
                  </label>
                  <VoiceInputButton
                    fieldKey="price"
                    fieldLabelKn="ಬೆಲೆ"
                    sampleText="e.g. 2500"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-stone-500 font-bold">₹</span>
                  <input
                    type="number"
                    min="100"
                    required
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className={`w-full bg-cream-50 border rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 ${
                      listeningField === 'price' ? 'border-red-500 bg-red-50/30 ring-2 ring-red-400' : 'border-cream-300'
                    }`}
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  You receive: ~{formatINR(Math.round(Number(price || 0) * 0.88))} directly (88% share)
                </p>
              </div>

              {/* Stock Quantity */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Quantity (ಪ್ರಮಾಣ)
                  </label>
                  <VoiceInputButton
                    fieldKey="stockQuantity"
                    fieldLabelKn="ಪ್ರಮಾಣ"
                    sampleText="e.g. 5"
                  />
                </div>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={stockQuantity}
                  onChange={e => setStockQuantity(e.target.value)}
                  className={`w-full bg-cream-50 border rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 ${
                    listeningField === 'stockQuantity' ? 'border-red-500 bg-red-50/30 ring-2 ring-red-400' : 'border-cream-300'
                  }`}
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Ready units in your workshop
                </p>
              </div>

            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="py-3 px-5 rounded-xl border border-cream-300 hover:bg-cream-100 text-stone-700 font-semibold text-xs flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="py-3.5 px-6 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm shadow-md flex items-center gap-2 active:scale-95 touch-target"
              >
                <span>Continue to Step 3 (ಕಥೆ ಸೇರಿಸಿ)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: STORY PROMPT ================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Quick 1-Tap Helper Templates */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Pre-filled Helper Templates (ಒತ್ತಿ ಆಯ್ಕೆಮಾಡಿ)
                </label>
                <span className="text-[11px] text-terracotta-600 font-semibold">1-Tap Autofill</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {STORY_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyTemplate(tmpl)}
                    className="p-3 bg-cream-100 hover:bg-cream-200 border border-cream-300 rounded-xl text-left transition-all text-xs"
                  >
                    <p className="font-bold text-indigo-900">{tmpl.templateTitle}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">{tmpl.hoursSpent}h • {tmpl.provenance}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Hours Spent & Provenance with Voice Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Hours Spent */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Hours Spent (ಶ್ರಮದ ಗಂಟೆಗಳು)</span>
                  </label>
                  <VoiceInputButton
                    fieldKey="hoursSpent"
                    fieldLabelKn="ಶ್ರಮದ ಗಂಟೆಗಳು"
                    sampleText="e.g. 48"
                  />
                </div>
                <input
                  type="number"
                  min="1"
                  required
                  value={hoursSpent}
                  onChange={e => setHoursSpent(e.target.value)}
                  className={`w-full bg-cream-50 border rounded-xl px-4 py-2.5 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 ${
                    listeningField === 'hoursSpent' ? 'border-red-500 bg-red-50/30 ring-2 ring-red-400' : 'border-cream-300'
                  }`}
                />
              </div>

              {/* Provenance Village */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-terracotta-600" />
                    <span>Provenance Village (ಊರು)</span>
                  </label>
                  <VoiceInputButton
                    fieldKey="provenanceLocation"
                    fieldLabelKn="ಊರು"
                    sampleText="e.g. Navalgund Dharwad"
                  />
                </div>
                <input
                  type="text"
                  required
                  value={provenanceLocation}
                  onChange={e => setProvenanceLocation(e.target.value)}
                  className={`w-full bg-cream-50 border rounded-xl px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 ${
                    listeningField === 'provenanceLocation' ? 'border-red-500 bg-red-50/30 ring-2 ring-red-400' : 'border-cream-300'
                  }`}
                />
              </div>

            </div>

            {/* Materials Used with Voice Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Materials & Dyes Used (ಬಳಸಿದ ಕಚ್ಚಾ ವಸ್ತುಗಳು)</span>
                </label>
                <VoiceInputButton
                  fieldKey="materialsUsed"
                  fieldLabelKn="ಕಚ್ಚಾ ವಸ್ತುಗಳು"
                  sampleText="e.g. Silk, organic cotton and indigo"
                />
              </div>
              <input
                type="text"
                required
                value={materialsUsed}
                onChange={e => setMaterialsUsed(e.target.value)}
                className={`w-full bg-cream-50 border rounded-xl px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 ${
                  listeningField === 'materialsUsed' ? 'border-red-500 bg-red-50/30 ring-2 ring-red-400' : 'border-cream-300'
                }`}
              />
            </div>

            {/* Cultural Significance / Story Description with Voice Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
                  <span>Craft Story & Cultural Description (ಕಲೆಯ ಸಾಂಸ್ಕೃತಿಕ ಮಹತ್ವ / ವಿವರ)</span>
                </label>
                <VoiceInputButton
                  fieldKey="culturalSignificance"
                  fieldLabelKn="ಕಲೆಯ ವಿವರ ಮತ್ತು ಕಥೆ"
                  sampleText="Speak full craft history..."
                />
              </div>
              <div className="relative">
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your motif history, temple lore, or speak using the Voice button above..."
                  value={culturalSignificance}
                  onChange={e => setCulturalSignificance(e.target.value)}
                  className={`w-full bg-cream-50 border rounded-xl px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 ${
                    listeningField === 'culturalSignificance' ? 'border-red-500 bg-red-50/30 ring-2 ring-red-400' : 'border-cream-300'
                  }`}
                />
                {listeningField === 'culturalSignificance' && (
                  <span className="absolute right-3 bottom-3 text-xs text-red-600 font-bold animate-pulse bg-white/90 px-2 py-0.5 rounded shadow">
                    Recording story... ಮಾತನಾಡಿ
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="py-3 px-5 rounded-xl border border-cream-300 hover:bg-cream-100 text-stone-700 font-semibold text-xs flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3.5 px-8 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm shadow-lg shadow-terracotta-600/30 flex items-center gap-2 active:scale-95 touch-target"
              >
                {isSubmitting ? (
                  <span>Publishing Craft Listing...</span>
                ) : (
                  <>
                    <Check className="w-5 h-5 text-amber-200" />
                    <span>Publish Craft to KaraKushala (ಪ್ರಕಟಿಸಿ)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </form>

    </div>
  );
}
