export type Locale = 'en' | 'ne' | 'hi'

export interface Translation {
  [key: string]: string | Translation
}

export interface Translations {
  [locale: string]: Translation
}

export const defaultLocale: Locale = 'en'

export const locales: Locale[] = ['en', 'ne', 'hi']

export const localeNames = {
  en: 'English',
  ne: 'नेपाली',
  hi: 'हिन्दी'
}

export const translations: Translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      about: 'About',
      teachings: 'Teachings',
      events: 'Events',
      media: 'Media',
      community: 'Community',
      contact: 'Contact',
      language: 'Language'
    },

    // Home Page
    home: {
      hero: {
        title: 'Sant Kabir Das',
        subtitle: 'Mystic Poet & Spiritual Teacher',
        description: 'Discover the timeless wisdom of Sant Kabir Das through his profound teachings on love, unity, and spiritual awakening.',
        cta: 'Explore Teachings'
      },
      dailyQuote: {
        title: 'Daily Wisdom',
        subtitle: 'Today\'s spiritual insight from Sant Kabir Das'
      },
      featuredTeachings: {
        title: 'Featured Teachings',
        subtitle: 'Dive deep into the spiritual wisdom that has guided seekers for centuries'
      },
      upcomingEvents: {
        title: 'Upcoming Events',
        subtitle: 'Join our community for spiritual gatherings and satsang'
      },
      community: {
        title: 'Our Community',
        subtitle: 'Connect with fellow seekers on the spiritual path'
      }
    },

    // About Page
    about: {
      title: 'About Sant Kabir Das',
      subtitle: 'The Revolutionary Mystic Poet of Medieval India',
      biography: 'Sant Kabir Das (1440-1518) was one of the most influential mystic poets and saints of medieval India. Born in Varanasi, he challenged the rigid boundaries of religion, caste, and social hierarchy through his profound spiritual poetry and teachings.',
      philosophy: {
        title: 'His Philosophy',
        unity: 'Unity of All Religions',
        unityDesc: 'Kabir taught that all religions lead to the same divine truth, famously saying "Ram and Rahim are one."',
        inner: 'Inner Divine Light',
        innerDesc: 'He emphasized that the divine resides within every soul and can be realized through sincere devotion and contemplation.',
        social: 'Social Equality',
        socialDesc: 'Kabir rejected caste discrimination and social hierarchies, advocating for the equality of all human beings.'
      }
    },

    // Teachings Page
    teachings: {
      title: 'Spiritual Teachings',
      subtitle: 'Timeless wisdom from Sant Kabir Das',
      categories: {
        all: 'All Teachings',
        divine: 'Divine Love',
        unity: 'Religious Unity',
        meditation: 'Meditation',
        social: 'Social Reform'
      },
      readMore: 'Read More',
      readingTime: 'min read'
    },

    // Events Page
    events: {
      title: 'Spiritual Events',
      subtitle: 'Join our community gatherings and satsang',
      upcoming: 'Upcoming Events',
      past: 'Past Events',
      register: 'Register',
      learnMore: 'Learn More',
      location: 'Location',
      time: 'Time',
      duration: 'Duration',
      organizer: 'Organizer'
    },

    // Media Page
    media: {
      title: 'Spiritual Media',
      subtitle: 'Audio and video content for spiritual growth',
      featured: 'Featured Content',
      all: 'All Media',
      audio: 'Audio',
      video: 'Video',
      duration: 'Duration',
      views: 'Views',
      downloads: 'Downloads'
    },

    // Community Page
    community: {
      title: 'Our Community',
      subtitle: 'Connect with fellow seekers worldwide',
      stats: {
        members: 'Community Members',
        countries: 'Countries Reached',
        teachings: 'Spiritual Teachings',
        events: 'Satsang Events'
      },
      newsletter: {
        title: 'Join Our Newsletter',
        description: 'Receive daily wisdom and community updates',
        subscribe: 'Subscribe'
      }
    },

    // Contact Page
    contact: {
      title: 'Contact Us',
      subtitle: 'Get in touch with our spiritual community',
      form: {
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        subject: 'Subject',
        message: 'Message',
        category: 'Category',
        send: 'Send Message',
        sending: 'Sending...'
      },
      categories: {
        general: 'General Inquiry',
        spiritual: 'Spiritual Guidance',
        events: 'Events & Satsang',
        media: 'Media & Teachings',
        volunteer: 'Volunteer Opportunities',
        technical: 'Technical Support'
      }
    },

    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      share: 'Share',
      download: 'Download',
      play: 'Play',
      pause: 'Pause',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      open: 'Open',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      author: 'Author',
      category: 'Category',
      tags: 'Tags'
    },

    // Footer
    footer: {
      tagline: 'Spreading the timeless wisdom of Sant Kabir Das',
      about: 'About',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      contact: 'Contact',
      newsletter: 'Newsletter',
      social: 'Follow Us',
      copyright: 'All rights reserved.'
    }
  },

  ne: {
    // Navigation
    nav: {
      home: 'मुख्य पृष्ठ',
      about: 'बारेमा',
      teachings: 'शिक्षाहरू',
      events: 'कार्यक्रमहरू',
      media: 'मिडिया',
      community: 'समुदाय',
      contact: 'सम्पर्क',
      language: 'भाषा'
    },

    // Home Page
    home: {
      hero: {
        title: 'सन्त कबीर दास',
        subtitle: 'रहस्यवादी कवि र आध्यात्मिक गुरु',
        description: 'प्रेम, एकता र आध्यात्मिक जागरणका गहिरो शिक्षाहरूमार्फत सन्त कबीर दासको कालातीत ज्ञान पत्ता लगाउनुहोस्।',
        cta: 'शिक्षाहरू अन्वेषण गर्नुहोस्'
      },
      dailyQuote: {
        title: 'दैनिक ज्ञान',
        subtitle: 'सन्त कबीर दासबाट आजको आध्यात्मिक अन्तर्दृष्टि'
      },
      featuredTeachings: {
        title: 'विशेष शिक्षाहरू',
        subtitle: 'शताब्दीयौंदेखि साधकहरूलाई मार्गदर्शन गर्दै आएको आध्यात्मिक ज्ञानमा गहिरो डुब्नुहोस्'
      },
      upcomingEvents: {
        title: 'आगामी कार्यक्रमहरू',
        subtitle: 'आध्यात्मिक भेला र सत्संगको लागि हाम्रो समुदायमा सामेल हुनुहोस्'
      },
      community: {
        title: 'हाम्रो समुदाय',
        subtitle: 'आध्यात्मिक मार्गमा साथी साधकहरूसँग जोडिनुहोस्'
      }
    },

    // About Page
    about: {
      title: 'सन्त कबीर दासको बारेमा',
      subtitle: 'मध्यकालीन भारतका क्रान्तिकारी रहस्यवादी कवि',
      biography: 'सन्त कबीर दास (१४४०-१५१८) मध्यकालीन भारतका सबैभन्दा प्रभावशाली रहस्यवादी कवि र सन्तहरूमध्ये एक थिए। वाराणसीमा जन्मेका उनले आफ्ना गहिरो आध्यात्मिक कविता र शिक्षाहरूमार्फत धर्म, जात र सामाजिक पदानुक्रमका कठोर सीमाहरूलाई चुनौती दिए।',
      philosophy: {
        title: 'उनको दर्शन',
        unity: 'सबै धर्महरूको एकता',
        unityDesc: 'कबीरले सिकाए कि सबै धर्महरूले एउटै ईश्वरीय सत्यतिर लैजान्छन्, प्रसिद्ध रूपमा भन्दै "राम र रहीम एक हुन्।"',
        inner: 'भित्री ईश्वरीय ज्योति',
        innerDesc: 'उनले जोड दिए कि ईश्वर हरेक आत्मामा बसेका छन् र इमानदार भक्ति र चिन्तनमार्फत महसुस गर्न सकिन्छ।',
        social: 'सामाजिक समानता',
        socialDesc: 'कबीरले जातीय भेदभाव र सामाजिक पदानुक्रमलाई अस्वीकार गरे, सबै मानिसहरूको समानताको वकालत गरे।'
      }
    },

    // Teachings Page
    teachings: {
      title: 'आध्यात्मिक शिक्षाहरू',
      subtitle: 'सन्त कबीर दासको कालातीत ज्ञान',
      categories: {
        all: 'सबै शिक्षाहरू',
        divine: 'ईश्वरीय प्रेम',
        unity: 'धार्मिक एकता',
        meditation: 'ध्यान',
        social: 'सामाजिक सुधार'
      },
      readMore: 'थप पढ्नुहोस्',
      readingTime: 'मिनेट पढाइ'
    },

    // Events Page
    events: {
      title: 'आध्यात्मिक कार्यक्रमहरू',
      subtitle: 'हाम्रो सामुदायिक भेला र सत्संगमा सामेल हुनुहोस्',
      upcoming: 'आगामी कार्यक्रमहरू',
      past: 'विगतका कार्यक्रमहरू',
      register: 'दर्ता गर्नुहोस्',
      learnMore: 'थप जान्नुहोस्',
      location: 'स्थान',
      time: 'समय',
      duration: 'अवधि',
      organizer: 'आयोजक'
    },

    // Media Page
    media: {
      title: 'आध्यात्मिक मिडिया',
      subtitle: 'आध्यात्मिक विकासको लागि अडियो र भिडियो सामग्री',
      featured: 'विशेष सामग्री',
      all: 'सबै मिडिया',
      audio: 'अडियो',
      video: 'भिडियो',
      duration: 'अवधि',
      views: 'हेराइ',
      downloads: 'डाउनलोड'
    },

    // Community Page
    community: {
      title: 'हाम्रो समुदाय',
      subtitle: 'विश्वभरका साथी साधकहरूसँग जोडिनुहोस्',
      stats: {
        members: 'समुदायका सदस्यहरू',
        countries: 'पुगेका देशहरू',
        teachings: 'आध्यात्मिक शिक्षाहरू',
        events: 'सत्संग कार्यक्रमहरू'
      },
      newsletter: {
        title: 'हाम्रो न्यूजलेटरमा सामेल हुनुहोस्',
        description: 'दैनिक ज्ञान र समुदायिक अपडेटहरू प्राप्त गर्नुहोस्',
        subscribe: 'सदस्यता लिनुहोस्'
      }
    },

    // Contact Page
    contact: {
      title: 'हामीलाई सम्पर्क गर्नुहोस्',
      subtitle: 'हाम्रो आध्यात्मिक समुदायसँग सम्पर्कमा रहनुहोस्',
      form: {
        name: 'पूरा नाम',
        email: 'इमेल ठेगाना',
        phone: 'फोन नम्बर',
        subject: 'विषय',
        message: 'सन्देश',
        category: 'श्रेणी',
        send: 'सन्देश पठाउनुहोस्',
        sending: 'पठाउँदै...'
      },
      categories: {
        general: 'सामान्य सोधपुछ',
        spiritual: 'आध्यात्मिक मार्गदर्शन',
        events: 'कार्यक्रम र सत्संग',
        media: 'मिडिया र शिक्षाहरू',
        volunteer: 'स्वयंसेवक अवसरहरू',
        technical: 'प्राविधिक सहायता'
      }
    },

    // Common
    common: {
      loading: 'लोड हुँदै...',
      error: 'त्रुटि',
      success: 'सफलता',
      save: 'सुरक्षित गर्नुहोस्',
      cancel: 'रद्द गर्नुहोस्',
      delete: 'मेटाउनुहोस्',
      edit: 'सम्पादन',
      view: 'हेर्नुहोस्',
      share: 'साझा गर्नुहोस्',
      download: 'डाउनलोड',
      play: 'बजाउनुहोस्',
      pause: 'रोक्नुहोस्',
      next: 'अर्को',
      previous: 'अघिल्लो',
      close: 'बन्द गर्नुहोस्',
      open: 'खोल्नुहोस्',
      search: 'खोज्नुहोस्',
      filter: 'फिल्टर',
      sort: 'क्रमबद्ध गर्नुहोस्',
      date: 'मिति',
      time: 'समय',
      location: 'स्थान',
      author: 'लेखक',
      category: 'श्रेणी',
      tags: 'ट्यागहरू'
    },

    // Footer
    footer: {
      tagline: 'सन्त कबीर दासको कालातीत ज्ञान फैलाउँदै',
      about: 'बारेमा',
      privacy: 'गोपनीयता नीति',
      terms: 'सेवाका सर्तहरू',
      contact: 'सम्पर्क',
      newsletter: 'न्यूजलेटर',
      social: 'हामीलाई फलो गर्नुहोस्',
      copyright: 'सबै अधिकार सुरक्षित।'
    }
  },

  hi: {
    // Navigation
    nav: {
      home: 'मुख्य पृष्ठ',
      about: 'परिचय',
      teachings: 'शिक्षाएँ',
      events: 'कार्यक्रम',
      media: 'मीडिया',
      community: 'समुदाय',
      contact: 'संपर्क',
      language: 'भाषा'
    },

    // Home Page
    home: {
      hero: {
        title: 'संत कबीर दास',
        subtitle: 'रहस्यवादी कवि और आध्यात्मिक गुरु',
        description: 'प्रेम, एकता और आध्यात्मिक जागृति की गहरी शिक्षाओं के माध्यम से संत कबीर दास की कालातीत बुद्धि की खोज करें।',
        cta: 'शिक्षाओं का अन्वेषण करें'
      },
      dailyQuote: {
        title: 'दैनिक ज्ञान',
        subtitle: 'संत कबीर दास से आज की आध्यात्मिक अंतर्दृष्टि'
      },
      featuredTeachings: {
        title: 'विशेष शिक्षाएँ',
        subtitle: 'सदियों से साधकों का मार्गदर्शन करने वाली आध्यात्मिक बुद्धि में गहराई से उतरें'
      },
      upcomingEvents: {
        title: 'आगामी कार्यक्रम',
        subtitle: 'आध्यात्मिक सभाओं और सत्संग के लिए हमारे समुदाय से जुड़ें'
      },
      community: {
        title: 'हमारा समुदाय',
        subtitle: 'आध्यात्मिक पथ पर साथी साधकों से जुड़ें'
      }
    },

    // About Page
    about: {
      title: 'संत कबीर दास के बारे में',
      subtitle: 'मध्यकालीन भारत के क्रांतिकारी रहस्यवादी कवि',
      biography: 'संत कबीर दास (1440-1518) मध्यकालीन भारत के सबसे प्रभावशाली रहस्यवादी कवि और संतों में से एक थे। वाराणसी में जन्मे, उन्होंने अपनी गहरी आध्यात्मिक कविता और शिक्षाओं के माध्यम से धर्म, जाति और सामाजिक पदानुक्रम की कठोर सीमाओं को चुनौती दी।',
      philosophy: {
        title: 'उनका दर्शन',
        unity: 'सभी धर्मों की एकता',
        unityDesc: 'कबीर ने सिखाया कि सभी धर्म एक ही दिव्य सत्य की ओर ले जाते हैं, प्रसिद्ध रूप से कहते हुए "राम और रहीम एक हैं।"',
        inner: 'आंतरिक दिव्य प्रकाश',
        innerDesc: 'उन्होंने जोर दिया कि परमात्मा हर आत्मा के भीतर निवास करता है और सच्ची भक्ति और चिंतन के माध्यम से महसूस किया जा सकता है।',
        social: 'सामाजिक समानता',
        socialDesc: 'कबीर ने जातिगत भेदभाव और सामाजिक पदानुक्रम को खारिज किया, सभी मनुष्यों की समानता की वकालत की।'
      }
    },

    // Teachings Page
    teachings: {
      title: 'आध्यात्मिक शिक्षाएँ',
      subtitle: 'संत कबीर दास की कालातीत बुद्धि',
      categories: {
        all: 'सभी शिक्षाएँ',
        divine: 'दिव्य प्रेम',
        unity: 'धार्मिक एकता',
        meditation: 'ध्यान',
        social: 'सामाजिक सुधार'
      },
      readMore: 'और पढ़ें',
      readingTime: 'मिनट पढ़ना'
    },

    // Events Page
    events: {
      title: 'आध्यात्मिक कार्यक्रम',
      subtitle: 'हमारी सामुदायिक सभाओं और सत्संग में शामिल हों',
      upcoming: 'आगामी कार्यक्रम',
      past: 'पिछले कार्यक्रम',
      register: 'पंजीकरण करें',
      learnMore: 'और जानें',
      location: 'स्थान',
      time: 'समय',
      duration: 'अवधि',
      organizer: 'आयोजक'
    },

    // Media Page
    media: {
      title: 'आध्यात्मिक मीडिया',
      subtitle: 'आध्यात्मिक विकास के लिए ऑडियो और वीडियो सामग्री',
      featured: 'विशेष सामग्री',
      all: 'सभी मीडिया',
      audio: 'ऑडियो',
      video: 'वीडियो',
      duration: 'अवधि',
      views: 'दृश्य',
      downloads: 'डाउनलोड'
    },

    // Community Page
    community: {
      title: 'हमारा समुदाय',
      subtitle: 'दुनिया भर के साथी साधकों से जुड़ें',
      stats: {
        members: 'समुदाय के सदस्य',
        countries: 'पहुँचे देश',
        teachings: 'आध्यात्मिक शिक्षाएँ',
        events: 'सत्संग कार्यक्रम'
      },
      newsletter: {
        title: 'हमारे न्यूज़लेटर में शामिल हों',
        description: 'दैनिक ज्ञान और समुदायिक अपडेट प्राप्त करें',
        subscribe: 'सदस्यता लें'
      }
    },

    // Contact Page
    contact: {
      title: 'संपर्क करें',
      subtitle: 'हमारे आध्यात्मिक समुदाय से संपर्क में रहें',
      form: {
        name: 'पूरा नाम',
        email: 'ईमेल पता',
        phone: 'फोन नंबर',
        subject: 'विषय',
        message: 'संदेश',
        category: 'श्रेणी',
        send: 'संदेश भेजें',
        sending: 'भेज रहे हैं...'
      },
      categories: {
        general: 'सामान्य पूछताछ',
        spiritual: 'आध्यात्मिक मार्गदर्शन',
        events: 'कार्यक्रम और सत्संग',
        media: 'मीडिया और शिक्षाएँ',
        volunteer: 'स्वयंसेवक अवसर',
        technical: 'तकनीकी सहायता'
      }
    },

    // Common
    common: {
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      save: 'सहेजें',
      cancel: 'रद्द करें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      view: 'देखें',
      share: 'साझा करें',
      download: 'डाउनलोड',
      play: 'चलाएं',
      pause: 'रोकें',
      next: 'अगला',
      previous: 'पिछला',
      close: 'बंद करें',
      open: 'खोलें',
      search: 'खोजें',
      filter: 'फिल्टर',
      sort: 'क्रमबद्ध करें',
      date: 'तारीख',
      time: 'समय',
      location: 'स्थान',
      author: 'लेखक',
      category: 'श्रेणी',
      tags: 'टैग'
    },

    // Footer
    footer: {
      tagline: 'संत कबीर दास की कालातीत बुद्धि फैला रहे हैं',
      about: 'परिचय',
      privacy: 'गोपनीयता नीति',
      terms: 'सेवा की शर्तें',
      contact: 'संपर्क',
      newsletter: 'न्यूज़लेटर',
      social: 'हमें फॉलो करें',
      copyright: 'सभी अधिकार सुरक्षित।'
    }
  }
}

export function useTranslations(locale: Locale = defaultLocale) {
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[locale]

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to English if translation not found
        value = translations.en
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return key // Return key if even English translation not found
          }
        }
        break
      }
    }

    return typeof value === 'string' ? value : key
  }

  return { t, locale }
}

export function getLocaleFromUrl(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean)
  const potentialLocale = segments[0] as Locale

  return locales.includes(potentialLocale) ? potentialLocale : defaultLocale
}

export function removeLocaleFromUrl(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  const potentialLocale = segments[0] as Locale

  if (locales.includes(potentialLocale)) {
    return '/' + segments.slice(1).join('/')
  }

  return pathname
}

export function addLocaleToUrl(pathname: string, locale: Locale): string {
  if (locale === defaultLocale) {
    return removeLocaleFromUrl(pathname)
  }

  const cleanPath = removeLocaleFromUrl(pathname)
  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`
}