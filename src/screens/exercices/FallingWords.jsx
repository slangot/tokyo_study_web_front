import React, { useEffect, useRef, useState } from 'react'

const FallingWords = () => {
  const [words, setWords] = useState([])
  const [balls, setBalls] = useState(0)
  const divRef = useRef(null)

  const hiragana = [
    "あ", "い", "う", "え", "お", // a, i, u, e, o
    "か", "き", "く", "け", "こ", // ka, ki, ku, ke, ko
    "さ", "し", "す", "せ", "そ", // sa, shi, su, se, so
    "た", "ち", "つ", "て", "と", // ta, chi, tsu, te, to
    "な", "に", "ぬ", "ね", "の", // na, ni, nu, ne, no
    "は", "ひ", "ふ", "へ", "ほ", // ha, hi, fu, he, ho
    "ま", "み", "む", "め", "も", // ma, mi, mu, me, mo
    "や", "ゆ", "よ", // ya, yu, yo
    "ら", "り", "る", "れ", "ろ", // ra, ri, ru, re, ro
    "わ", "を", "ん", // wa, wo, n
    "が", "ぎ", "ぐ", "げ", "ご", // ga, gi, gu, ge, go
    "ざ", "じ", "ず", "ぜ", "ぞ", // za, ji, zu, ze, zo
    "だ", "ぢ", "づ", "で", "ど", // da, ji, zu, de, do
    "ば", "び", "ぶ", "べ", "ぼ", // ba, bi, bu, be, bo
    "ぱ", "ぴ", "ぷ", "ぺ", "ぽ", // pa, pi, pu, pe, po
    "きゃ", "きゅ", "きょ", // kya, kyu, kyo
    "しゃ", "しゅ", "しょ", // sha, shu, sho
    "ちゃ", "ちゅ", "ちょ", // cha, chu, cho
    "にゃ", "にゅ", "にょ", // nya, nyu, nyo
    "ひゃ", "ひゅ", "ひょ", // hya, hyu, hyo
    "みゃ", "みゅ", "みょ", // mya, myu, myo
    "りゃ", "りゅ", "りょ", // rya, ryu, ryo
    "ぎゃ", "ぎゅ", "ぎょ", // gya, gyu, gyo
    "じゃ", "じゅ", "じょ", // ja, ju, jo
    "びゃ", "びゅ", "びょ", // bya, byu, byo
    "ぴゃ", "ぴゅ", "ぴょ"  // pya, pyu, pyo
  ];

  const wordsList = [
    {id:1, japanese:"ここのつ", french: "neuf"},
    {id:2, japanese:"いちにち", french: "un jour"},
    {id:3, japanese:"じょうぶ", french: "fort, durable"},
    {id:4, japanese:"わたくし", french: "moi (poli)"},
    {id:5, japanese:"いろ", french: "couleur"},
    {id:6, japanese:"らいしゅう", french: "semaine prochaine"},
    {id:7, japanese:"あれ", french: "cela"},
    {id:8, japanese:"ひる", french: "midi"},
    {id:9, japanese:"きいろ", french: "jaune"},
    {id:10, japanese:"おととし", french: "l’année avant, l’année dernière"},
    {id:11, japanese:"じどうしゃ", french: "automobile"},
    {id:12, japanese:"たいせつ", french: "important"},
    {id:13, japanese:"ほしい", french: "vouloir"},
    {id:14, japanese:"みち", french: "rue"},
    {id:15, japanese:"テーブル", french: "table"},
    {id:16, japanese:"のみもの", french: "boisson"},
    {id:17, japanese:"カメラ", french: "appareil photo"},
    {id:18, japanese:"テレビ", french: "télévision"},
    {id:19, japanese:"はんぶん", french: "demi-minute"},
    {id:20, japanese:"かびん", french: "vase"},
    {id:21, japanese:"ひだり", french: "gauche"},
    {id:22, japanese:"へん", french: "zone"},
    {id:23, japanese:"まいにち", french: "quotidiennement"},
    {id:24, japanese:"くつした", french: "chaussettes"},
    {id:25, japanese:"わるい", french: "mauvais"},
    {id:26, japanese:"ほんとう", french: "vrai, véritable"},
    {id:27, japanese:"ときどき", french: "parfois"},
    {id:28, japanese:"もっと", french: "plus"},
    {id:29, japanese:"きく", french: "entendre, écouter"},
    {id:30, japanese:"ベッド", french: "lit"},
    {id:31, japanese:"ばんごう", french: "numéro"},
    {id:32, japanese:"クラス", french: "classe"},
    {id:33, japanese:"ひと", french: "personne"},
    {id:34, japanese:"いえ", french: "maison"},
    {id:35, japanese:"ひがし", french: "est"},
    {id:36, japanese:"ならぶ", french: "alignée, rangée, mettre en rang, faire la queue"},
    {id:37, japanese:"おとこ", french: "homme"},
    {id:38, japanese:"みっか", french: "trois jours, troisième jour du mois"},
    {id:39, japanese:"でぐち", french: "sortie"},
    {id:40, japanese:"テープレコーダー", french: "magnétophone"},
    {id:41, japanese:"はやい", french: "rapide"},
    {id:42, japanese:"せんたく", french: "linge"},
    {id:43, japanese:"とけい", french: "montre, horloge"},
    {id:44, japanese:"いくら", french: "combien (argent)"},
    {id:45, japanese:"じゅう, とお", french: "dix"},
    {id:46, japanese:"しぬ", french: "mourir"},
    {id:47, japanese:"きえる", french: "disparaître"},
    {id:48, japanese:"トイレ", french: "toilettes"},
    {id:49, japanese:"こうばん", french: "commissariat"},
    {id:50, japanese:"あるく", french: "marcher"},
    {id:51, japanese:"はいざら", french: "cendrier"},
    {id:52, japanese:"やさい", french: "légume"},
    {id:53, japanese:"みぎ", french: "droite"},
    {id:54, japanese:"パン", french: "pain"},
    {id:55, japanese:"いしゃ", french: "docteur"},
    {id:56, japanese:"とる", french: "prendre"},
    {id:57, japanese:"ひゃく", french: "cent"},
    {id:58, japanese:"カレンダー", french: "calendrier"},
    {id:59, japanese:"コート", french: "manteau"},
    {id:60, japanese:"ドア", french: "porte"},
    {id:61, japanese:"あらう", french: "laver"},
    {id:62, japanese:"べんり", french: "utile, pratique"},
    {id:63, japanese:"コピーする", french: "copier"},
    {id:64, japanese:"うみ", french: "mer"},
    {id:65, japanese:"どうぞ", french: "s'il vous plaît"},
    {id:66, japanese:"もういちど", french: "encore une fois"},
    {id:67, japanese:"すずしい", french: "rafraîchissant"},
    {id:68, japanese:"かんじ", french: "kanji (caractère)"},
    {id:69, japanese:"まっすぐ", french: "en face, tout droit, direct"},
    {id:70, japanese:"さむい", french: "froid"},
    {id:71, japanese:"あまい", french: "sucré"},
    {id:72, japanese:"なく", french: "bruit des animaux"},
    {id:73, japanese:"きっさてん", french: "salon de thé"},
    {id:74, japanese:"まん", french: "dix mille"},
    {id:75, japanese:"ゆうがた", french: "soir, soirée, fin d'après-midi"},
    {id:76, japanese:"きょうしつ", french: "salle de classe"},
    {id:77, japanese:"たいへん", french: "sérieux, très, énormément"},
    {id:78, japanese:"きんようび", french: "vendredi"},
    {id:79, japanese:"ふうとう", french: "enveloppe"},
    {id:80, japanese:"いろいろ", french: "divers, varié"},
    {id:81, japanese:"アパート", french: "appartement"},
    {id:82, japanese:"あさって", french: "après-demain"},
    {id:83, japanese:"でんわ", french: "téléphone"},
    {id:84, japanese:"からだ", french: "corps"},
    {id:85, japanese:"にもつ", french: "bagage"},
    {id:86, japanese:"つくる", french: "fabriquer"},
    {id:87, japanese:"かす", french: "prêter"},
    {id:88, japanese:"とまる", french: "stopper"},
    {id:89, japanese:"ふるい", french: "ancien"},
    {id:90, japanese:"でかける", french: "sortir"},
    {id:91, japanese:"よく", french: "souvent"},
    {id:92, japanese:"きって", french: "timbre-poste"},
    {id:93, japanese:"ゆき", french: "neige"},
    {id:94, japanese:"はく", french: "mettre, porter (bas)"},
    {id:95, japanese:"は", french: "dent"},
    {id:96, japanese:"かえる", french: "revenir"},
    {id:97, japanese:"みみ", french: "oreille"},
    {id:98, japanese:"あなた", french: "toi"},
    {id:99, japanese:"むずかしい", french: "difficile"},
    {id:100, japanese:"どうぶつ", french: "animal"},
    {id:101, japanese:"ぶんしょう", french: "texte"},
    {id:102, japanese:"いそがしい", french: "occupé"},
    {id:103, japanese:"たぶん", french: "probablement, peut-être"},
    {id:104, japanese:"はなす", french: "parler"},
    {id:105, japanese:"びょういん", french: "hôpital"},
    {id:106, japanese:"いち", french: "un"},
    {id:107, japanese:"それでは", french: "alors"},
    {id:108, japanese:"あたま", french: "tête"},
    {id:109, japanese:"らいげつ", french: "mois prochain"},
    {id:110, japanese:"かぞく", french: "famille"},
    {id:111, japanese:"ひく", french: "jouer d’un instrument à cordes / piano"},
    {id:112, japanese:"はなし", french: "histoire"},
    {id:113, japanese:"ちかてつ", french: "métro"},
    {id:114, japanese:"うる", french: "vendre"},
    {id:115, japanese:"かりる", french: "emprunter"},
    {id:116, japanese:"いつも", french: "toujours"},
    {id:117, japanese:"ごはん", french: "riz, repas"},
    {id:118, japanese:"ぼうし", french: "chapeau"},
    {id:119, japanese:"ふる", french: "tomber (pluie ou neige)"},
    {id:120, japanese:"おかね", french: "argent"},
    {id:121, japanese:"むこう", french: "là-bas"},
    {id:122, japanese:"いぬ", french: "chien"},
    {id:123, japanese:"つける", french: "allumer, mettre, appliquer"},
    {id:124, japanese:"じしょ", french: "dictionnaire"},
    {id:125, japanese:"がくせい", french: "étudiant"},
    {id:126, japanese:"かてい", french: "ménage"},
    {id:127, japanese:"ごご", french: "après-midi"},
    {id:128, japanese:"すぐに", french: "immédiatement, tout de suite"},
    {id:129, japanese:"すこし", french: "un peu"},
    {id:130, japanese:"スリッパ", french: "pantoufles"},
    {id:131, japanese:"はな", french: "nez"},
    {id:132, japanese:"せんせい", french: "enseignant, médecin"},
    {id:133, japanese:"まど", french: "fenêtre"},
    {id:134, japanese:"ほそい", french: "mince"},
    {id:135, japanese:"めがね", french: "lunettes"},
    {id:136, japanese:"にぎやか", french: "animé"},
    {id:137, japanese:"つとめる", french: "travailler pour quelqu'un"},
    {id:138, japanese:"ちょっと", french: "un peu"},
    {id:139, japanese:"くる", french: "venir"},
    {id:140, japanese:"よる", french: "soir, nuit"},
    {id:141, japanese:"れんしゅうする", french: "s’entraîner"},
    {id:142, japanese:"ふろ", french: "bain"},
    {id:143, japanese:"タクシー", french: "taxi"},
    {id:144, japanese:"としょかん", french: "bibliothèque"},
    {id:145, japanese:"き", french: "arbre, bois"},
    {id:146, japanese:"その", french: "celui-là"},
    {id:147, japanese:"おさけ", french: "alcool"},
    {id:148, japanese:"おいしい", french: "délicieux, bon"},
    {id:149, japanese:"うたう", french: "chanter"},
    {id:150, japanese:"おおぜい", french: "beaucoup de monde"},
    {id:151, japanese:"れい", french: "zéro"},
    {id:152, japanese:"てがみ", french: "lettre"},
    {id:153, japanese:"ざっし", french: "magazine"},
    {id:154, japanese:"てんき", french: "temps (météo)"},
    {id:155, japanese:"はる", french: "printemps"},
    {id:156, japanese:"カレー", french: "curry"},
    {id:157, japanese:"まだ", french: "encore, jusqu'à présent"},
    {id:158, japanese:"ちいさな", french: "peu"},
    {id:159, japanese:"きゅう / く", french: "neuf"},
    {id:160, japanese:"もくようび", french: "Jeudi"},
    {id:161, japanese:"あね", french: "grande-soeur"},
    {id:162, japanese:"にわ", french: "jardin"},
    {id:163, japanese:"いいえ", french: "non"},
    {id:164, japanese:"がいこくじん", french: "étranger"},
    {id:165, japanese:"ようふく", french: "vêtements de style occidental"},
    {id:166, japanese:"どなた", french: "qui"},
    {id:167, japanese:"けす", french: "effacer, éteindre"},
    {id:168, japanese:"ページ", french: "page"},
    {id:169, japanese:"できる", french: "être capable de faire"},
    {id:170, japanese:"もんだい", french: "problème"},
    {id:171, japanese:"すう", french: "fumer, sucer"},
    {id:172, japanese:"ペット", french: "animal de compagnie"},
    {id:173, japanese:"おかあさん", french: "mère"},
    {id:174, japanese:"わたす", french: "remettre"},
    {id:175, japanese:"さいふ", french: "portefeuille"},
    {id:176, japanese:"もん", french: "porte"},
    {id:177, japanese:"ホテル", french: "hôtel"},
    {id:178, japanese:"ながい", french: "long"},
    {id:179, japanese:"あびる", french: "prendre une douche, se baigner"},
    {id:180, japanese:"とりにく", french: "volaille"},
    {id:181, japanese:"まいげつ / まいつき", french: "chaque mois"},
    {id:182, japanese:"まいあさ", french: "tous les matins"},
    {id:183, japanese:"はしる", french: "pour exécuter"},
    {id:184, japanese:"え", french: "dessin"},
    {id:185, japanese:"かようび", french: "mardi"},
    {id:186, japanese:"むいか", french: "six jours, sixième jour du mois"},
    {id:187, japanese:"ひろい", french: "spacieux, large"},
    {id:188, japanese:"じゅぎょう", french: "cours"},
    {id:189, japanese:"くろい", french: "noir"},
    {id:190, japanese:"のる", french: "monter"},
    {id:191, japanese:"あまり", french: "pas très"},
    {id:192, japanese:"おりる", french: "descendre"},
    {id:193, japanese:"だいどころ", french: "cuisine"},
    {id:194, japanese:"むっつ", french: "six (compteur)"},
    {id:195, japanese:"コップ", french: "tasse"},
    {id:196, japanese:"しる", french: "savoir"},
    {id:197, japanese:"となり", french: "à côté de"},
    {id:198, japanese:"いかが", french: "que diriez-vous de"},
    {id:199, japanese:"ななつ", french: "sept (compteur)"},
    {id:200, japanese:"どこ", french: "où"},
    {id:201, japanese:"ひとり", french: "une personne"},
    {id:202, japanese:"さんぽする", french: "flâner"},
    {id:203, japanese:"おぼえる", french: "se souvenir"},
    {id:204, japanese:"しめる", french: "lier"},
    {id:205, japanese:"シャワー", french: "douche"},
    {id:206, japanese:"ちょうど", french: "exactement, juste, correct"},
    {id:207, japanese:"つくえ", french: "bureau"},
    {id:208, japanese:"せんげつ", french: "le mois dernier"},
    {id:209, japanese:"やすむ", french: "se reposer"},
    {id:210, japanese:"いたい", french: "douloureux"},
    {id:211, japanese:"かぜ", french: "vent"},
    {id:212, japanese:"ねる", french: "dormir"},
    {id:213, japanese:"おとうさん", french: "père"},
    {id:214, japanese:"こたえる", french: "répondre"},
    {id:215, japanese:"けさ", french: "ce matin"},
    {id:216, japanese:"みせる", french: "montrer"},
    {id:217, japanese:"くだもの", french: "fruit"},
    {id:218, japanese:"あさ", french: "matin"},
    {id:219, japanese:"きいろい", french: "jaune"},
    {id:220, japanese:"いりぐち", french: "entrée"},
    {id:221, japanese:"えき", french: "gare"},
    {id:222, japanese:"ふつか", french: "deux jours, deuxième jour"},
    {id:223, japanese:"りょうしん", french: "parents"},
    {id:224, japanese:"あおい", french: "bleu"},
    {id:225, japanese:"ナイフ", french: "couteau"},
    {id:226, japanese:"あか", french: "rouge"},
    {id:227, japanese:"わたる", french: "traverser"},
    {id:228, japanese:"ゆっくり", french: "lentement"},
    {id:229, japanese:"やっつ", french: "huit (compteur)"},
    {id:230, japanese:"だれ", french: "qui"},
    {id:231, japanese:"あめ", french: "pluie"},
    {id:232, japanese:"みじかい", french: "court"},
    {id:233, japanese:"ばん", french: "soirée"},
    {id:234, japanese:"おそい", french: "tard, lent"},
    {id:235, japanese:"フィルム", french: "film"},
    {id:236, japanese:"やる", french: "faire, effectuer"},
    {id:237, japanese:"わかる", french: "comprendre"},
    {id:238, japanese:"あたたかい", french: "chaud"},
    {id:239, japanese:"かわ", french: "rivière"},
    {id:240, japanese:"おねえさん", french: "soeur aînée"},
    {id:241, japanese:"おおきな", french: "grand"},
    {id:242, japanese:"べんきょうする", french: "étudier"},
    {id:243, japanese:"おおい", french: "nombreux"},
    {id:244, japanese:"はやい", french: "tôt"},
    {id:245, japanese:"およぐ", french: "nager"},
    {id:246, japanese:"かばん", french: "sac"},
    {id:247, japanese:"それ", french: "cela"},
    {id:248, japanese:"ラジオ", french: "radio"},
    {id:249, japanese:"すわる", french: "s'asseoir"},
    {id:250, japanese:"はる", french: "s'en tenir"},
    {id:251, japanese:"そうじする", french: "nettoyer"},
    {id:252, japanese:"まるい", french: "rond, circulaire"},
    {id:253, japanese:"あける", french: "ouvrir"},
    {id:254, japanese:"れいぞうこ", french: "réfrigérateur"},
    {id:255, japanese:"やすみ", french: "repos, vacances"},
    {id:256, japanese:"きょねん", french: "année dernière"},
    {id:257, japanese:"め", french: "oeil"},
    {id:258, japanese:"ください", french: "s'il vous plaît"},
    {id:259, japanese:"ストーブ", french: "chauffage"},
    {id:260, japanese:"だす", french: "envoyer"},
    {id:261, japanese:"さす", french: "tendre la main, ouvrir un parapluie"},
    {id:262, japanese:"ひこうき", french: "avion"},
    {id:263, japanese:"はし", french: "baguettes"},
    {id:264, japanese:"おんな", french: "femme"},
    {id:265, japanese:"あく", french: "ouvrir, être ouvert"},
    {id:266, japanese:"いま", french: "maintenant"},
    {id:267, japanese:"とおか", french: "dix jours, le dixième jour"},
    {id:268, japanese:"あぶない", french: "dangereux"},
    {id:269, japanese:"じゃ / じゃあ", french: "alors"},
    {id:270, japanese:"あめ", french: "bonbon"},
    {id:271, japanese:"ちず", french: "carte"},
    {id:272, japanese:"さらいねん", french: "l’année après, l’année prochaine"},
    {id:273, japanese:"ひま", french: "temps libre"},
    {id:274, japanese:"つぎ", french: "suivant"},
    {id:275, japanese:"どの", french: "lequel"},
    {id:276, japanese:"ぺん", french: "stylo"},
    {id:277, japanese:"する", french: "faire"},
    {id:278, japanese:"あう", french: "rencontrer"},
    {id:279, japanese:"こんげつ", french: "ce mois-ci"},
    {id:280, japanese:"よぶ", french: "appeler, inviter"},
    {id:281, japanese:"かぎ", french: "clé"},
    {id:282, japanese:"した", french: "au-dessous"},
    {id:283, japanese:"かるい", french: "lumière"},
    {id:284, japanese:"はつか", french: "vingt jours, vingtième jour"},
    {id:285, japanese:"たつ", french: "se lever"},
    {id:286, japanese:"はたらく", french: "travailler"},
    {id:287, japanese:"いつつ", french: "cinq (compteur)"},
    {id:288, japanese:"なつやすみ", french: "vacances d'été"},
    {id:289, japanese:"おふろ", french: "bain"},
    {id:290, japanese:"よわい", french: "faible"},
    {id:291, japanese:"まえ", french: "avant, devant"},
    {id:292, japanese:"うた", french: "chanson"},
    {id:293, japanese:"いる", french: "être"},
    {id:294, japanese:"シャツ", french: "chemise"},
    {id:295, japanese:"それから", french: "et puis"},
    {id:296, japanese:"パーティー", french: "fête"},
    {id:297, japanese:"おんがく", french: "musique"},
    {id:298, japanese:"たて", french: "vertical, verticalement"},
    {id:299, japanese:"じてんしゃ", french: "vélo"},
    {id:300, japanese:"えいご", french: "langue anglaise"}
  ]

  const generateRandomKana = () => {
    const kanaPosition = Math.floor(Math.random() * hiragana.length)
    // console.log('kanaPosition : ', kanaPosition)
    // console.log('hiragana[kanaPosition] : ', hiragana[kanaPosition])
    return hiragana[kanaPosition]
  }

  const handleBalls = (action) => {
    const currentBalls = balls
    if(action === "plus") {
      setBalls(currentBalls + 1)
    } else {
      setBalls(currentBalls - 1)
    }
  }
  
    const generateBalls = () => {
      // const currentBalls = balls
      // setBalls(currentBalls + 1)
      const newKana = generateRandomKana()
      const postNode = document.createElement('div');
      const rColor = Math.floor(Math.random() * 255) + 1
      const gColor = Math.floor(Math.random() * 255) + 1
      const bColor = Math.floor(Math.random() * 255) + 1

      console.log(`rgb(${rColor}, ${gColor}, ${bColor})`)

      postNode.className = 'text-shadow falling-ball flex w-14 h-14 text-xl rounded-full justify-center items-center font-bold shadow-md shadow-black'; // Ajoute des classes pour le style
      postNode.innerText = newKana;
      postNode.style.position = 'absolute'; // Assure que les éléments sont en position absolue pour permettre le mouvement
      // postNode.style.top = '0px'; // Départ du haut
      postNode.style.top = `${Math.random() * 85}%`; // Départ du haut
      postNode.style.left = `calc(${Math.random() * 90}% + 40px)`; // Position horizontale aléatoire
      // postNode.style.left = `${Math.random() * 85}%`; // Position horizontale aléatoire
      postNode.style.backgroundColor = `rgb(${rColor}, ${gColor}, ${bColor})`
  
      // Ajout de l'animation de chute
      // const fallSpeed = Math.random() * 1.5 + 2; // Vitesse de chute aléatoire
      // let top = 0;
      // const fallInterval = setInterval(() => {
      //   top += fallSpeed;
      //   postNode.style.top = `${top}px`;
  
      //   // Si l'élément sort de l'écran, on l'enlève
      //   if (top > window.innerHeight) {
      //     clearInterval(fallInterval);
      //     postNode.remove();
      //   }
      // }, 50);

      // Ajoute l'événement de clic pour déclencher l'explosion
    postNode.onclick = () => {
      postNode.classList.add('explode');
      // clearInterval(fallInterval);
      const wordsListLength = words.length
      // setWords(prev => [...prev, {id: wordsListLength, kana: newKana}])
      setWords(prev => [...prev, newKana])
      if(balls === 9) {
        handleBalls('minus')
      }
      // setBalls(balls - 1)

      // Retirer le div après l'animation
      postNode.addEventListener('animationend', () => {
        postNode.remove();
      });
    };

      divRef.current.appendChild(postNode);
    };

    const handleVerify = () => {
      const wordToCheck = words.join("")
      console.log('words : ', words)
      console.log('wordToCheck : ', wordToCheck)
      const matchFound = wordsList.some(value => value.japanese === wordToCheck);
  
  if (matchFound) {
    console.log("Correspondance trouvée !");
    // Tu peux faire quelque chose ici, par exemple mettre à jour un état, afficher un message, etc.
  } else {
    console.log("Pas de correspondance trouvée.");
  }
    }
  
    useEffect(() => {
      if(balls < 10) {
        const intervalId = setInterval(() => {
          handleBalls('plus')
          generateBalls();
        }, 250);
      // Nettoyage de l'intervalle lorsque le composant est démonté
      return () => clearInterval(intervalId);
      }
  
    }, [balls]);
  
console.log(balls)

    return (
      <section className='section-bottom w-full h-full'>
        <div ref={divRef} className={`bg-bg-pattern w-full md:w-3/4 h-3/4 absolute overflow-hidden`}>
          {/* Div pour contenir les éléments générés */}
        </div>
        <div className='fixed bottom-0 flex bg-blue-400 w-full h-1/4 gap-1 md:gap-2 py-3 px-3'>
          {words.map(e => {
            return <p className='flex justify-center items-center w-10 h-10 bg-yellow-600 font-bold rounded-full'>{e}</p>
          })}
          <button className='absolute flex justify-center items-center w-10 h-10 bg-green-600 font-bold rounded-full right-2' onClick={() => handleVerify()}>V</button>
        </div>
        {/* Exemple de rendu des données si tu veux les utiliser */}
        {/* {words && words.map((e, index) => (
          <p key={index}>id: {index + 1}, japanese: "{e.japanese}", french: "{e.french}"</p>
        ))} */}
      </section>
    );
  };
  
  export default FallingWords;
  