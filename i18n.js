/* The Worst Curse — regional language detection + copy deck.
   Add a language: append a block to STRINGS (same keys) and list its code in SUPPORTED.
   Add a region:   add one COUNTRY_LANG entry (ISO 3166-1 alpha-2 -> language code),
                   plus a TZ_COUNTRY entry if that country's browsers report no region tag. */
(function () {
  var SUPPORTED = ["en", "ru"];

  // Region rules win over the browser UI language. Everything not listed gets English.
  var COUNTRY_LANG = { RU: "ru", BY: "ru", UA: "ru" };

  // Fallback signal for browsers that report a language with no region tag.
  var TZ_COUNTRY = {
    "Europe/Moscow": "RU", "Europe/Kaliningrad": "RU", "Europe/Samara": "RU",
    "Europe/Volgograd": "RU", "Europe/Saratov": "RU", "Europe/Astrakhan": "RU",
    "Europe/Ulyanovsk": "RU", "Europe/Kirov": "RU", "Asia/Yekaterinburg": "RU",
    "Asia/Omsk": "RU", "Asia/Novosibirsk": "RU", "Asia/Barnaul": "RU",
    "Asia/Tomsk": "RU", "Asia/Novokuznetsk": "RU", "Asia/Krasnoyarsk": "RU",
    "Asia/Irkutsk": "RU", "Asia/Chita": "RU", "Asia/Yakutsk": "RU",
    "Asia/Khandyga": "RU", "Asia/Vladivostok": "RU", "Asia/Ust-Nera": "RU",
    "Asia/Magadan": "RU", "Asia/Sakhalin": "RU", "Asia/Srednekolymsk": "RU",
    "Asia/Kamchatka": "RU", "Asia/Anadyr": "RU",
    "Europe/Minsk": "BY", "Europe/Kyiv": "UA", "Europe/Kiev": "UA",
    "Europe/Simferopol": "UA", "Europe/Uzhgorod": "UA", "Europe/Zaporozhye": "UA"
  };

  function langTags() {
    try {
      return (navigator.languages && navigator.languages.length)
        ? navigator.languages.slice() : [navigator.language || ""];
    } catch (e) { return []; }
  }

  function country() {
    var tags = langTags();
    for (var i = 0; i < tags.length; i++) {
      var m = String(tags[i]).match(/-([A-Za-z]{2})$/);
      if (m) return m[1].toUpperCase();
    }
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && TZ_COUNTRY[tz]) return TZ_COUNTRY[tz];
    } catch (e) {}
    return null;
  }

  function detect(override) {
    if (override && override !== "auto" && SUPPORTED.indexOf(override) > -1) return override;
    var c = country();
    if (c) return COUNTRY_LANG[c] || "en";
    // region unknown: last resort is the browser's own language
    var tags = langTags();
    for (var i = 0; i < tags.length; i++) {
      if (String(tags[i]).toLowerCase().split("-")[0] === "ru") return "ru";
    }
    return "en";
  }

  var STRINGS = {
    en: {
      navHome: "Home", navMake: "Make a Curse", navHow: "How It Works", navFaq: "FAQs",
      heroHeadline: "Wanna Make|a Curse?", footerHeadline: "You Know Who.",
      scrollDown1: "Scroll", scrollDown2: "down", scrollUp1: "Scroll", scrollUp2: "up",
      makeTitle: "Make a Curse", makeSub: "Choose wisely. They probably deserve it.",
      victimTitle: "Victim Name", victimPh: "Enter a name or nickname...",
      fateTitle: "Choose Their Fate", fateSelect: "Select a curse...",
      notEvilTitle: "Not Evil Enough?", customLead: "Create your own curse – ",
      customBody: "Got something more annoyingly specific in mind? Write your own completely fictional inconvenience.",
      customPh: "Enter your curse...",
      payTitle: "Pay & Cast", paySub: "Secure checkout. No refunds for the damned.",
      cardName: "Cardholder name", cardNamePh: "Name on card", cardNumber: "Card number",
      cardExpiry: "Expiration date", cardCvc: "CVC",
      stripeNote: "Card details are handled directly by Stripe.",
      stripeTest: "Stripe test mode — use card 4242 4242 4242 4242.",
      stripeNoApi: "Stripe is not connected in this preview — deploy with your keys to take real payments.",
      stripeFail: "Stripe could not start: ",
      castCta: "Cast the Curse", castPay: "Pay {price} & Cast the Curse", processing: "Processing…",
      successTitle: "Curse successfully sent.", successSub: "It’s out of your hands now.",
      successBtn: "Curse Someone Else", successNote: "They deserve it.",
      howTitle: "How It Works",
      howSub: "No complicated rituals. No full moon required. Just three simple steps.",
      step1a: "Name Your", step1b: "Victim",
      step1Body: "Enter the name of the person who deserves a little cosmic inconvenience.",
      step2a: "Choose", step2b: "Their Fate",
      step2Body: "Pick one of our carefully selected curses – or write your own if you’re feeling creative.",
      step3a: "Cast The", step3b: "Curse",
      step3Body: "Complete your order and leave the rest to the universe. Their slightly worse day is now out of your hands.",
      howFoot: "✦ 100% true. 100% actual supernatural power. ✦",
      faqTitle: "FAQs", faqSub: "Questions before you ruin someone’s day? Fair enough.",
      faq: [
        ["Do the curses actually work?", "Absolutely. Results may vary depending on karma, Wi-Fi connection, and the current mood of the universe."],
        ["How long does a curse take to work?", "Could be five minutes. Could be five years. The universe has terrible customer service."],
        ["Is this legal?", "Completely. Mild inconvenience is not yet regulated."],
        ["Can I cancel a curse?", "Once it’s out there, it’s out there. The universe doesn’t have an Undo button."]
      ],
      curses: [
        "The line next to yours is always faster.",
        "You can never find the second earbud.",
        "Your Wi-Fi slows down when you need it most.",
        "Your phone is always at 9%.",
        "Every USB takes three tries.",
        "Your charger only works at one angle.",
        "One sock always disappears in the laundry.",
        "Your fitted sheet always pops off one corner.",
        "Your sleeves get wet when you wash your hands.",
        "Your headphones always catch on door handles.",
        "Your toast always lands topping-side down.",
        "Your shopping cart always has one bad wheel.",
        "Your password is always “incorrect” on the first try.",
        "Your delivery arrives five minutes after you leave.",
        "Your socks are always slightly damp.",
        "Your pillow is always warm on both sides.",
        "You always pick the slowest checkout.",
        "Your shoelaces randomly come undone.",
        "Your phone falls between the bed and the wall.",
        "You always forget why you entered the room.",
        "Your autocorrect changes the right word.",
        "Your screen brightness is always slightly wrong.",
        "Your cereal gets soggy immediately.",
        "Your ice cream always melts too fast.",
        "Your favorite song always gets interrupted.",
        "You always step on one mysterious wet spot.",
        "Your blanket never covers both feet and shoulders.",
        "Your pen stops working when someone asks to borrow it.",
        "Your popcorn always has too many unpopped kernels.",
        "Your alarm goes off right before the best part of your dream."
      ]
    },

    ru: {
      navHome: "Главная", navMake: "Наложить проклятие", navHow: "Как это работает", navFaq: "Вопросы",
      heroHeadline: "Хочешь наложить|проклятие?", footerHeadline: "Сам Знаешь Кто.",
      scrollDown1: "Листай", scrollDown2: "вниз", scrollUp1: "Наверх", scrollUp2: "страницы",
      makeTitle: "Наложить проклятие", makeSub: "Выбирайте с умом. Скорее всего, он это заслужил.",
      victimTitle: "Имя жертвы", victimPh: "Введите имя или прозвище...",
      fateTitle: "Выберите судьбу", fateSelect: "Выберите проклятие...",
      notEvilTitle: "Мало зла?", customLead: "Придумайте своё проклятие – ",
      customBody: "Есть кое-что ещё более раздражающее? Опишите собственную полностью выдуманную неприятность.",
      customPh: "Введите своё проклятие...",
      payTitle: "Оплатить и наложить", paySub: "Безопасная оплата. Проклятым возврат не положен.",
      cardName: "Имя владельца карты", cardNamePh: "Имя на карте", cardNumber: "Номер карты",
      cardExpiry: "Срок действия", cardCvc: "CVC",
      stripeNote: "Данные карты обрабатывает напрямую Stripe.",
      stripeTest: "Тестовый режим Stripe — используйте карту 4242 4242 4242 4242.",
      stripeNoApi: "Stripe не подключён в этом превью — опубликуйте сайт со своими ключами для реальных платежей.",
      stripeFail: "Не удалось запустить Stripe: ",
      castCta: "Наложить проклятие", castPay: "Оплатить {price} и наложить проклятие", processing: "Обработка…",
      successTitle: "Проклятие успешно отправлено.", successSub: "Теперь это уже не в ваших руках.",
      successBtn: "Проклясть кого-нибудь ещё", successNote: "Он это заслужил.",
      howTitle: "Как это работает",
      howSub: "Никаких сложных ритуалов. Полная луна не нужна. Всего три простых шага.",
      step1a: "Назовите", step1b: "жертву",
      step1Body: "Введите имя того, кто заслуживает небольшой космической неприятности.",
      step2a: "Выберите", step2b: "судьбу",
      step2Body: "Выберите одно из наших тщательно отобранных проклятий – или придумайте своё.",
      step3a: "Наложите", step3b: "проклятие",
      step3Body: "Завершите заказ и доверьте остальное вселенной. Его слегка испорченный день больше не ваша забота.",
      howFoot: "✦ 100 % правда. 100 % настоящая сверхъестественная сила. ✦",
      faqTitle: "Частые вопросы", faqSub: "Есть вопросы, прежде чем испортить кому-то день? Справедливо.",
      faq: [
        ["Проклятия действительно работают?", "Разумеется. Результат зависит от кармы, качества Wi-Fi и текущего настроения вселенной."],
        ["Сколько ждать эффекта?", "Может, пять минут. Может, пять лет. У вселенной ужасная служба поддержки."],
        ["Это законно?", "Совершенно. Легкие неудобства пока никак не регулируются."],
        ["Можно ли отменить проклятие?", "Что отправлено — то отправлено. У вселенной нет кнопки «Отменить»."]
      ],
      curses: [
        "Соседняя очередь всегда движется быстрее.",
        "Второй наушник никогда не находится.",
        "Wi-Fi замедляется в самый нужный момент.",
        "На телефоне всегда 9 % заряда.",
        "Каждый USB вставляется только с третьего раза.",
        "Зарядка работает лишь под одним углом.",
        "Один носок всегда исчезает при стирке.",
        "Простыня всегда слетает с одного угла.",
        "Рукава намокают, когда моете руки.",
        "Наушники цепляются за все дверные ручки.",
        "Бутерброд всегда падает намазанной стороной.",
        "У тележки в магазине всегда одно колесо кривое.",
        "Пароль всегда «неверный» с первого раза.",
        "Доставка приезжает через пять минут после вашего ухода.",
        "Носки всегда чуть влажные.",
        "Подушка тёплая с обеих сторон.",
        "Вы всегда выбираете самую медленную кассу.",
        "Шнурки развязываются сами собой.",
        "Телефон падает между кроватью и стеной.",
        "Вы всегда забываете, зачем зашли в комнату.",
        "Автозамена исправляет правильное слово.",
        "Яркость экрана всегда чуть не такая.",
        "Хлопья размокают мгновенно.",
        "Мороженое всегда тает слишком быстро.",
        "Любимую песню всегда прерывают.",
        "Вы всегда наступаете в загадочную мокрую лужу.",
        "Одеяла никогда не хватает и на ноги, и на плечи.",
        "Ручка перестаёт писать, когда её просят одолжить.",
        "В попкорне всегда слишком много нераскрывшихся зёрен.",
        "Будильник звонит прямо перед лучшим моментом сна."
      ]
    }
  };

  window.WORST_I18N = {
    supported: SUPPORTED,
    countryLang: COUNTRY_LANG,
    tzCountry: TZ_COUNTRY,
    strings: STRINGS,
    detect: detect,
    country: country
  };
  try { window.dispatchEvent(new Event("worst-i18n-ready")); } catch (e) {}
})();
