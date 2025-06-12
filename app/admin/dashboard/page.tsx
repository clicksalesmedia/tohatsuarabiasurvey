'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Survey {
  _id: string;
  step1?: string;
  step2?: string;
  step3?: string;
  step4?: string;
  fullName?: string;
  email?: string;
  city?: string;
  phone?: string;
  factors?: string[];
  powers?: string[];
  submittedAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    fetchSurveys();
  }, [session, status, router]);

  const fetchSurveys = async () => {
    try {
      const response = await fetch('/api/admin/surveys');
      if (response.ok) {
        const data = await response.json();
        setSurveys(data.surveys);
      } else {
        console.error('Failed to fetch surveys');
      }
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSurveys = surveys.filter(survey =>
    survey.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAgeLabel = (value?: string) => {
    const ageMap: { [key: string]: string } = {
      '60+': '٦٠ سنة وأكثر',
      '50-59': '٥٠ إلى ٥٩ سنة',
      '40-49': '٤٠ إلى ٤٩ سنة',
      '30-39': '٣٠ إلى ٣٩ سنة',
      '20-29': '٢٠ إلى ٢٩ سنة',
      '19-': '١٩ وأقل',
      'no-answer': 'لا أرغب في الإجابة'
    };
    return ageMap[value || ''] || value;
  };

  const getRegionLabel = (value?: string) => {
    const regionMap: { [key: string]: string } = {
      'western': 'المنطقة الغربية',
      'eastern': 'المنطقة الشرقية',
      'southern': 'المنطقة الجنوبية',
      'northern': 'المنطقة الشمالية'
    };
    return regionMap[value || ''] || value;
  };

  const getExperienceLabel = (value?: string) => {
    const experienceMap: { [key: string]: string } = {
      'hobbyist': 'هاوي',
      'professional': 'محترف',
      'livelihood': 'البحر مصدر رزقي',
      'beginner': 'مبتدئ',
      'other': 'غير ذلك'
    };
    return experienceMap[value || ''] || value;
  };

  const getKnowledgeLabel = (value?: string) => {
    const knowledgeMap: { [key: string]: string } = {
      'good': 'معرفة جيدة',
      'superficial': 'معرفة سطحية',
      'unsure': 'لست متأكد من معلوماتي',
      'none': 'ليس لدي أي معلومات',
      'other': 'غير ذلك'
    };
    return knowledgeMap[value || ''] || value;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-100" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src="https://cdnmedia.endeavorsuite.com/images/showcase/productOwner_colorLogos/marine/tohatsu.png"
                alt="Tohatsu Logo"
                className="h-12 ml-4"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">لوحة تحكم الإدارة</h1>
                <p className="text-gray-600">إدارة استبيانات محركات توهاتسو البحرية</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-colors font-medium"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full ml-4">
                <i className="fas fa-clipboard-list text-blue-600 text-xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{surveys.length}</h3>
                <p className="text-gray-600">إجمالي الاستبيانات</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full ml-4">
                <i className="fas fa-calendar-day text-green-600 text-xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {surveys.filter(s => new Date(s.submittedAt).toDateString() === new Date().toDateString()).length}
                </h3>
                <p className="text-gray-600">اليوم</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full ml-4">
                <i className="fas fa-calendar-week text-purple-600 text-xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {surveys.filter(s => {
                    const surveyDate = new Date(s.submittedAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return surveyDate >= weekAgo;
                  }).length}
                </h3>
                <p className="text-gray-600">هذا الأسبوع</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center">
            <i className="fas fa-search text-gray-400 text-xl ml-3"></i>
            <input
              type="text"
              placeholder="البحث بالاسم، البريد الإلكتروني، أو المدينة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            />
          </div>
        </div>

        {/* Surveys Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">الاستبيانات المرسلة</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الاسم</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">البريد الإلكتروني</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">المدينة</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">تاريخ الإرسال</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSurveys.map((survey) => (
                  <tr key={survey._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{survey.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900" dir="ltr">{survey.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{survey.city}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatDate(survey.submittedAt)}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setSelectedSurvey(survey)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        عرض التفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredSurveys.length === 0 && (
              <div className="text-center py-12">
                <i className="fas fa-inbox text-gray-400 text-4xl mb-4"></i>
                <p className="text-gray-500 text-lg">لا توجد استبيانات مطابقة للبحث</p>
              </div>
            )}
          </div>
        </div>

        {/* Survey Detail Modal */}
        {selectedSurvey && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                <h3 className="text-2xl font-bold text-gray-800">تفاصيل الاستبيان</h3>
                <button
                  onClick={() => setSelectedSurvey(null)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">المعلومات الشخصية</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">الاسم:</span> {selectedSurvey.fullName}</p>
                      <p><span className="font-medium">البريد الإلكتروني:</span> {selectedSurvey.email}</p>
                      <p><span className="font-medium">المدينة:</span> {selectedSurvey.city}</p>
                      <p><span className="font-medium">الهاتف:</span> {selectedSurvey.phone}</p>
                      <p><span className="font-medium">تاريخ الإرسال:</span> {formatDate(selectedSurvey.submittedAt)}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">المعلومات الديموغرافية</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">العمر:</span> {getAgeLabel(selectedSurvey.step1)}</p>
                      <p><span className="font-medium">المنطقة:</span> {getRegionLabel(selectedSurvey.step2)}</p>
                      <p><span className="font-medium">العلاقة بالبحر:</span> {getExperienceLabel(selectedSurvey.step3)}</p>
                      <p><span className="font-medium">معرفة توهاتسو:</span> {getKnowledgeLabel(selectedSurvey.step4)}</p>
                    </div>
                  </div>
                </div>
                
                {selectedSurvey.factors && selectedSurvey.factors.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">عوامل الشراء المهمة</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSurvey.factors.map((factor, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSurvey.powers && selectedSurvey.powers.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">قوة المحركات المطلوبة</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSurvey.powers.map((power, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          {power} حصان
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"
      />
    </div>
  );
} 