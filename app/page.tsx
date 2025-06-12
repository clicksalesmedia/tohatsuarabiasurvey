'use client';

import { useState } from "react";
import { Noto_Kufi_Arabic } from 'next/font/google';

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

interface FormData {
  step1?: string;
  step2?: string;
  step3?: string;
  step4?: string;
  experienceOther?: string;
  knowledgeOther?: string;
  powers?: string[];
  powerOther?: string;
  factors?: string[];
  factorsOther?: string;
  fullName?: string;
  email?: string;
  city?: string;
  phone?: string;
  [key: string]: string | string[] | undefined;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [showThankYou, setShowThankYou] = useState(false);
  
  const totalSteps = 7;

  const updateProgress = () => {
    const progress = (currentStep / totalSteps) * 100;
    return progress;
  };

  const validateCurrentStep = () => {
    if (currentStep <= 4) {
      // For radio button steps
      const stepData = formData[`step${currentStep}`];
      if (!stepData) {
        alert('يرجى اختيار إجابة للمتابعة');
        return false;
      }
    } else if (currentStep === 7) {
      // For personal information step
      const required = ['fullName', 'email', 'city', 'phone'];
      for (const field of required) {
        if (!formData[field] || typeof formData[field] !== 'string' || !formData[field].trim()) {
          alert('يرجى ملء جميع الحقول المطلوبة');
          return false;
        }
      }
      
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email || '')) {
        alert('يرجى إدخال بريد إلكتروني صحيح');
        return false;
      }
      
      // Validate phone
      const phoneRegex = /^05\d{8}$/;
      if (!phoneRegex.test(formData.phone || '')) {
        alert('يرجى إدخال رقم هاتف صحيح (05xxxxxxxx)');
        return false;
      }
    }
    
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (name: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFactorsChange = (value: string, checked: boolean) => {
    const currentFactors = formData.factors || [];
    let newFactors;
    
    if (checked) {
      if (currentFactors.length >= 2) {
        alert('يمكنك اختيار خيارين فقط');
        return;
      }
      newFactors = [...currentFactors, value];
    } else {
      newFactors = currentFactors.filter((f: string) => f !== value);
    }
    
    setFormData(prev => ({
      ...prev,
      factors: newFactors
    }));
  };

  const submitSurvey = async () => {
    if (validateCurrentStep()) {
      try {
        const response = await fetch('/api/survey/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setShowThankYou(true);
          console.log('Survey submitted successfully', formData);
        } else {
          alert('حدث خطأ أثناء إرسال الاستبيان. يرجى المحاولة مرة أخرى.');
        }
      } catch (error) {
        console.error('Error submitting survey:', error);
        alert('حدث خطأ أثناء إرسال الاستبيان. يرجى المحاولة مرة أخرى.');
      }
    }
  };

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-100 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto text-center transform animate-fadeIn">
          <div className="text-green-500 text-6xl mb-6 animate-bounce">
            <i className="fas fa-check-circle" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">شكراً لك!</h2>
          <p className="text-gray-600 text-xl mb-8">
            تم إرسال الاستبيان بنجاح. نقدر وقتك ومشاركتك معنا.
          </p>
          <p className="text-gray-500 text-lg">
            سيتم التواصل معك قريباً بناءً على إجاباتك.
          </p>
        </div>
      </div>
    );
  }





  return (
    <>
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-100 ${notoKufiArabic.className}`} dir="rtl">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12 animate-slideDown">
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
              <img
                src="https://cdnmedia.endeavorsuite.com/images/showcase/productOwner_colorLogos/marine/tohatsu.png"
                alt="Tohatsu Logo"
                className="mx-auto mb-6 h-20 filter drop-shadow-md"
              />
              <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                استبيان محركات توهاتسو البحرية
              </h1>
              <p className="text-gray-600 text-lg">مساعدتك في فهم احتياجاتك البحرية أفضل</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                  الخطوة {currentStep} من {totalSteps}
                </span>
                <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  {Math.round(updateProgress())}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                  style={{ width: `${updateProgress()}%` }}
                />
              </div>
            </div>
          </div>

          {/* Survey Container */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto animate-slideUp">
            
            {/* Step 1: Age */}
            {currentStep === 1 && (
              <div className="step-content animate-fadeIn">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                  <i className="fas fa-user-clock text-blue-500 ml-3" />
                  ما هو عمرك؟
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { value: "60+", label: "٦٠ سنة وأكثر" },
                    { value: "50-59", label: "٥٠ إلى ٥٩ سنة" },
                    { value: "40-49", label: "٤٠ إلى ٤٩ سنة" },
                    { value: "30-39", label: "٣٠ إلى ٣٩ سنة" },
                    { value: "20-29", label: "٢٠ إلى ٢٩ سنة" },
                    { value: "19-", label: "١٩ وأقل" }
                  ].map((option) => (
                    <label key={option.value} className={`flex items-center p-5 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md ${formData.step1 === option.value ? 'border-blue-500 bg-blue-50' : ''}`}>
                      <input
                        type="radio"
                        name="age"
                        value={option.value}
                        className="hidden"
                        onChange={() => handleInputChange('step1', option.value)}
                        checked={formData.step1 === option.value}
                      />
                      <div className={`w-6 h-6 border-2 border-blue-500 rounded-full ml-4 flex items-center justify-center ${formData.step1 === option.value ? 'bg-blue-500' : ''}`}>
                        {formData.step1 === option.value && <div className="w-3 h-3 bg-white rounded-full" />}
                      </div>
                      <span className="text-lg font-medium">{option.label}</span>
                    </label>
                  ))}
                  <label className={`flex items-center p-5 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md md:col-span-2 ${formData.step1 === 'no-answer' ? 'border-blue-500 bg-blue-50' : ''}`}>
                    <input
                      type="radio"
                      name="age"
                      value="no-answer"
                      className="hidden"
                      onChange={() => handleInputChange('step1', 'no-answer')}
                      checked={formData.step1 === 'no-answer'}
                    />
                    <div className={`w-6 h-6 border-2 border-blue-500 rounded-full ml-4 flex items-center justify-center ${formData.step1 === 'no-answer' ? 'bg-blue-500' : ''}`}>
                      {formData.step1 === 'no-answer' && <div className="w-3 h-3 bg-white rounded-full" />}
                    </div>
                    <span className="text-lg font-medium">لا أرغب في الإجابة</span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 2: Region */}
            {currentStep === 2 && (
              <div className="step-content animate-fadeIn">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                  <i className="fas fa-map-marker-alt text-blue-500 ml-3" />
                  في أي منطقة تقوم بنشاطاتك البحرية؟
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { value: "western", title: "المنطقة الغربية", desc: "جدة، ثول، رابغ، ينبع" },
                    { value: "eastern", title: "المنطقة الشرقية", desc: "الخبر، الدمام، الأحساء، الجبيل، قطيف، سيهات" },
                    { value: "southern", title: "المنطقة الجنوبية", desc: "الشعيبة، القنفذة، جازان" },
                    { value: "northern", title: "المنطقة الشمالية", desc: "أملج، الوجه، ضبا" }
                  ].map((option) => (
                    <label key={option.value} className={`flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md ${formData.step2 === option.value ? 'border-blue-500 bg-blue-50' : ''}`}>
                      <input
                        type="radio"
                        name="region"
                        value={option.value}
                        className="hidden"
                        onChange={() => handleInputChange('step2', option.value)}
                        checked={formData.step2 === option.value}
                      />
                      <div className={`w-6 h-6 border-2 border-blue-500 rounded-full ml-4 flex items-center justify-center flex-shrink-0 ${formData.step2 === option.value ? 'bg-blue-500' : ''}`}>
                        {formData.step2 === option.value && <div className="w-3 h-3 bg-white rounded-full" />}
                      </div>
                      <div>
                        <span className="text-lg font-bold text-gray-800 block">{option.title}</span>
                        <p className="text-sm text-gray-600 mt-1">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Marine Experience */}
            {currentStep === 3 && (
              <div className="step-content animate-fadeIn">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                  <i className="fas fa-anchor text-blue-500 ml-3" />
                  ما مدى اتصالك/علاقتك بالبحر؟
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { value: "hobbyist", title: "هاوي", desc: "أمارس هواية لها علاقة بالبحر" },
                    { value: "professional", title: "محترف", desc: "صاحب قارب/هوري/طراد/بوت/يخت أو غواص أو صياد" },
                    { value: "livelihood", title: "البحر مصدر رزقي", desc: "صياد، رحلات سياحية" },
                    { value: "beginner", title: "مبتدئ", desc: "الرغبة موجودة بس ما بدأت" }
                  ].map((option) => (
                    <label key={option.value} className={`flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md ${formData.step3 === option.value ? 'border-blue-500 bg-blue-50' : ''}`}>
                      <input
                        type="radio"
                        name="experience"
                        value={option.value}
                        className="hidden"
                        onChange={() => handleInputChange('step3', option.value)}
                        checked={formData.step3 === option.value}
                      />
                      <div className={`w-6 h-6 border-2 border-blue-500 rounded-full ml-4 flex items-center justify-center flex-shrink-0 ${formData.step3 === option.value ? 'bg-blue-500' : ''}`}>
                        {formData.step3 === option.value && <div className="w-3 h-3 bg-white rounded-full" />}
                      </div>
                      <div>
                        <span className="text-lg font-bold text-gray-800 block">{option.title}</span>
                        <p className="text-sm text-gray-600 mt-1">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                  <label className={`flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md ${formData.step3 === 'other' ? 'border-blue-500 bg-blue-50' : ''}`}>
                    <input
                      type="radio"
                      name="experience"
                      value="other"
                      className="hidden"
                      onChange={() => handleInputChange('step3', 'other')}
                      checked={formData.step3 === 'other'}
                    />
                    <div className={`w-6 h-6 border-2 border-blue-500 rounded-full ml-4 flex items-center justify-center flex-shrink-0 ${formData.step3 === 'other' ? 'bg-blue-500' : ''}`}>
                      {formData.step3 === 'other' && <div className="w-3 h-3 bg-white rounded-full" />}
                    </div>
                    <span className="text-lg font-medium">غير ذلك</span>
                  </label>
                  {formData.step3 === 'other' && (
                    <div className="animate-slideDown">
                      <input
                        type="text"
                        placeholder="اذكر..."
                        className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        onChange={(e) => handleInputChange('experienceOther', e.target.value)}
                        value={formData.experienceOther || ''}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Tohatsu Knowledge */}
            {currentStep === 4 && (
              <div className="step-content animate-fadeIn">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                  <i className="fas fa-cog text-blue-500 ml-3" />
                  ما مدى معرفتك بمحركات توهاتسو اليابانية؟
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { value: "good", label: "معرفة جيدة" },
                    { value: "superficial", label: "معرفة سطحية" },
                    { value: "unsure", label: "لست متأكد من معلوماتي" },
                    { value: "none", label: "ليس لدي أي معلومات" }
                  ].map((option) => (
                    <label key={option.value} className={`flex items-center p-5 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md ${formData.step4 === option.value ? 'border-blue-500 bg-blue-50' : ''}`}>
                      <input
                        type="radio"
                        name="knowledge"
                        value={option.value}
                        className="hidden"
                        onChange={() => handleInputChange('step4', option.value)}
                        checked={formData.step4 === option.value}
                      />
                      <div className={`w-6 h-6 border-2 border-blue-500 rounded-full ml-4 flex items-center justify-center ${formData.step4 === option.value ? 'bg-blue-500' : ''}`}>
                        {formData.step4 === option.value && <div className="w-3 h-3 bg-white rounded-full" />}
                      </div>
                      <span className="text-lg font-medium">{option.label}</span>
                    </label>
                  ))}
                  <label className={`flex items-center p-5 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md md:col-span-2 ${formData.step4 === 'other' ? 'border-blue-500 bg-blue-50' : ''}`}>
                    <input
                      type="radio"
                      name="knowledge"
                      value="other"
                      className="hidden"
                      onChange={() => handleInputChange('step4', 'other')}
                      checked={formData.step4 === 'other'}
                    />
                    <div className={`w-6 h-6 border-2 border-blue-500 rounded-full ml-4 flex items-center justify-center ${formData.step4 === 'other' ? 'bg-blue-500' : ''}`}>
                      {formData.step4 === 'other' && <div className="w-3 h-3 bg-white rounded-full" />}
                    </div>
                    <span className="text-lg font-medium">غير ذلك</span>
                  </label>
                  {formData.step4 === 'other' && (
                    <div className="md:col-span-2 animate-slideDown">
                      <input
                        type="text"
                        placeholder="اذكر..."
                        className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        onChange={(e) => handleInputChange('knowledgeOther', e.target.value)}
                        value={formData.knowledgeOther || ''}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Engine Power */}
            {currentStep === 5 && (
              <div className="step-content animate-fadeIn">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                  <i className="fas fa-tachometer-alt text-blue-500 ml-3" />
                  إذا افترضنا (جدلاً) أنك ستطلب محركات بحرية، ما هي قوة الأحصنة التي ستطلبها؟
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    "2.5", "5", "10", "15", "20", "25", "40", "60", "90", "100", "115", "140"
                  ].map((power) => (
                    <div key={power} className="p-5 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md">
                      <label className="flex items-center justify-between mb-3">
                        <span className="text-lg font-medium">{power} حصان</span>
                        <input
                          type="checkbox"
                          name="power"
                          value={power}
                          className="hidden"
                          onChange={(e) => {
                            const currentPowers = formData.powers || [];
                            if (e.target.checked) {
                              handleInputChange('powers', [...currentPowers, power]);
                            } else {
                              handleInputChange('powers', currentPowers.filter((p: string) => p !== power));
                            }
                          }}
                          checked={(formData.powers || []).includes(power)}
                        />
                        <div className={`w-6 h-6 border-2 border-blue-500 rounded flex items-center justify-center ${(formData.powers || []).includes(power) ? 'bg-blue-500' : ''}`}>
                          {(formData.powers || []).includes(power) && <i className="fas fa-check text-white text-sm" />}
                        </div>
                      </label>
                      <input
                        type="number"
                        placeholder="العدد"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        min="0"
                        onChange={(e) => handleInputChange(`power_${power}_count`, e.target.value)}
                        value={formData[`power_${power}_count`] || ''}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-5 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300">
                  <label className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      name="power"
                      value="other"
                      className="hidden"
                      onChange={(e) => {
                        const currentPowers = formData.powers || [];
                        if (e.target.checked) {
                          handleInputChange('powers', [...currentPowers, 'other']);
                        } else {
                          handleInputChange('powers', currentPowers.filter((p: string) => p !== 'other'));
                        }
                      }}
                      checked={(formData.powers || []).includes('other')}
                    />
                    <div className={`w-6 h-6 border-2 border-blue-500 rounded flex items-center justify-center ml-3 ${(formData.powers || []).includes('other') ? 'bg-blue-500' : ''}`}>
                      {(formData.powers || []).includes('other') && <i className="fas fa-check text-white text-sm" />}
                    </div>
                    <span className="text-lg font-medium">غير ذلك</span>
                  </label>
                  <input
                    type="text"
                    placeholder="اذكر..."
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    onChange={(e) => handleInputChange('powerOther', e.target.value)}
                    value={formData.powerOther || ''}
                  />
                </div>
              </div>
            )}

            {/* Step 6: Purchase Factors */}
            {currentStep === 6 && (
              <div className="step-content animate-fadeIn">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                  <i className="fas fa-shopping-cart text-blue-500 ml-3" />
                  في رأيك، ما هي (أهم) نقطة في قرار شراء المحركات؟
                </h2>
                <p className="text-center text-gray-600 mb-8 text-lg bg-yellow-50 p-3 rounded-lg border border-yellow-200">(اختر خيارين فقط)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { value: "price", label: "السعر" },
                    { value: "efficiency", label: "كفاءة البنزين" },
                    { value: "spare-parts", label: "توفر قطع الغيار" },
                    { value: "after-sales", label: "الخدمة بعد البيع" },
                    { value: "weight", label: "الوزن" },
                    { value: "design", label: "الشكل" },
                    { value: "country", label: "البلد المصنع" },
                    { value: "reliability", label: "الاعتمادية/الصلابة" }
                  ].map((factor) => (
                    <label key={factor.value} className={`flex items-center p-5 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md ${(formData.factors || []).includes(factor.value) ? 'border-blue-500 bg-blue-50' : ''}`}>
                      <input
                        type="checkbox"
                        name="factors"
                        value={factor.value}
                        className="hidden"
                        onChange={(e) => handleFactorsChange(factor.value, e.target.checked)}
                        checked={(formData.factors || []).includes(factor.value)}
                      />
                      <div className={`w-6 h-6 border-2 border-blue-500 rounded flex items-center justify-center ml-4 ${(formData.factors || []).includes(factor.value) ? 'bg-blue-500' : ''}`}>
                        {(formData.factors || []).includes(factor.value) && <i className="fas fa-check text-white text-sm" />}
                      </div>
                      <span className="text-lg font-medium">{factor.label}</span>
                    </label>
                  ))}
                  <label className={`flex items-center p-5 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md md:col-span-2 ${(formData.factors || []).includes('other') ? 'border-blue-500 bg-blue-50' : ''}`}>
                    <input
                      type="checkbox"
                      name="factors"
                      value="other"
                      className="hidden"
                      onChange={(e) => handleFactorsChange('other', e.target.checked)}
                      checked={(formData.factors || []).includes('other')}
                    />
                    <div className={`w-6 h-6 border-2 border-blue-500 rounded flex items-center justify-center ml-4 ${(formData.factors || []).includes('other') ? 'bg-blue-500' : ''}`}>
                      {(formData.factors || []).includes('other') && <i className="fas fa-check text-white text-sm" />}
                    </div>
                    <span className="text-lg font-medium">غير ذلك</span>
                  </label>
                  {(formData.factors || []).includes('other') && (
                    <div className="md:col-span-2 animate-slideDown">
                      <input
                        type="text"
                        placeholder="اذكر..."
                        className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        onChange={(e) => handleInputChange('factorsOther', e.target.value)}
                        value={formData.factorsOther || ''}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 7: Personal Information */}
            {currentStep === 7 && (
              <div className="step-content animate-fadeIn">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                  <i className="fas fa-user text-blue-500 ml-3" />
                  المعلومات الشخصية
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">الاسم الكامل *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="الاسم الكامل"
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      value={formData.fullName || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">البريد الإلكتروني *</label>
                    <input
                      type="email"
                      required
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="example@email.com"
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      value={formData.email || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">المدينة *</label>
                    <select
                      required
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      value={formData.city || ''}
                    >
                      <option value="">اختر المدينة</option>
                      <option value="riyadh">الرياض</option>
                      <option value="jeddah">جدة</option>
                      <option value="mecca">مكة المكرمة</option>
                      <option value="medina">المدينة المنورة</option>
                      <option value="dammam">الدمام</option>
                      <option value="khobar">الخبر</option>
                      <option value="dhahran">الظهران</option>
                      <option value="jubail">الجبيل</option>
                      <option value="qatif">القطيف</option>
                      <option value="abha">أبها</option>
                      <option value="taif">الطائف</option>
                      <option value="buraidah">بريدة</option>
                      <option value="tabuk">تبوك</option>
                      <option value="hail">حائل</option>
                      <option value="najran">نجران</option>
                      <option value="jazan">جازان</option>
                      <option value="arar">عرعر</option>
                      <option value="sakaka">سكاكا</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">رقم الهاتف *</label>
                    <input
                      type="tel"
                      required
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="05xxxxxxxx"
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      value={formData.phone || ''}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
              <button
                onClick={previousStep}
                className={`bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-4 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center font-medium shadow-lg transform hover:scale-105 ${currentStep === 1 ? 'invisible' : ''}`}
              >
                <i className="fas fa-arrow-right ml-2" />
                السابق
              </button>
              
              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center font-medium shadow-lg transform hover:scale-105"
                >
                  التالي
                  <i className="fas fa-arrow-left mr-2" />
                </button>
              ) : (
                <button
                  onClick={submitSurvey}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center font-medium shadow-lg transform hover:scale-105"
                >
                  <i className="fas fa-check ml-2" />
                  إرسال الاستبيان
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out;
        }
      `}</style>
    </>
  );
}
