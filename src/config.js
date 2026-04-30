const CONFIG = {
  rounds: [
    {
      persona: { name: 'Sally', age: 36 },
      question: 'What does she buy next?',
      hint: 'Look beyond the obvious...',
      purchaseImage: '../assets/Game_Round_1/lawn_mower_robot.png',
      purchaseLabel: 'Robot Lawnmower',
      options: [
        { image: '../assets/Game_Round_1/jeans.png', label: 'Jeans' },
        { image: '../assets/Game_Round_1/sex_toy.png', label: 'Sex Toy' },
        { image: '../assets/Game_Round_1/shoes.png', label: 'Shoes' },
        { image: '../assets/Game_Round_1/golf_bag.png', label: 'Golf Bag' }
      ],
      correctIndex: 1
    },
    {
      persona: { name: 'Marcus', age: 52 },
      question: 'What does he buy next?',
      hint: 'Challenge your assumptions...',
      purchaseImage: '../assets/Game_Round_2/military_jacket.png',
      purchaseLabel: 'Military Jacket',
      options: [
        { image: '../assets/Game_Round_2/chair.png', label: 'Chair' },
        { image: '../assets/Game_Round_2/muesli.png', label: 'Muesli' },
        { image: '../assets/Game_Round_2/flowers.png', label: 'Flowers' },
        { image: '../assets/Game_Round_2/tennis_racket.png', label: 'Tennis Racket' }
      ],
      correctIndex: 2
    },
    {
      persona: { name: 'Tim', age: 28 },
      question: 'What does he buy next?',
      hint: 'Skip the cliché...',
      purchaseImage: '../assets/Game_Round_3/motorcycle_helmet.png',
      purchaseLabel: 'Motorcycle Helmet',
      options: [
        { image: '../assets/Game_Round_3/boots.png', label: 'Boots' },
        { image: '../assets/Game_Round_3/puzzle.png', label: 'Puzzle' },
        { image: '../assets/Game_Round_3/sunglasses.png', label: 'Sunglasses' },
        { image: '../assets/Game_Round_3/boxers.png', label: 'Boxers' }
      ],
      correctIndex: 1
    }
  ],

  gifts: [
    {
      brand: 'Emma',
      name: '2x Elite Pillows',
      description: '2-Pack, Emma Elite Support Pillow',
      price: '150,00 \u20ac',
      logo: '../assets/assets_and_code_for_selection_part/emma_logo.png',
      product: '../assets/assets_and_code_for_selection_part/emma_product.png',
      bannerColor: '#403833'
    },
    {
      brand: 'IKEA',
      name: '150 \u20ac Gift card',
      description: 'Home, furniture & living',
      cta: 'Redesign your comfort space!',
      logo: '../assets/assets_and_code_for_selection_part/ikea_logo.png',
      product: '../assets/assets_and_code_for_selection_part/ikea_product.png',
      bannerColor: '#0158a3'
    },
    {
      brand: 'Ninja',
      name: 'Airfryer',
      description: 'Foodi MAX Dual Zone AF400EU',
      price: '179,99 \u20ac',
      logo: '../assets/assets_and_code_for_selection_part/Ninja_logo_12069.png',
      product: '../assets/assets_and_code_for_selection_part/ninja_product.png',
      bannerColor: '#9caf88'
    },
    {
      brand: 'H&M',
      name: '150 \u20ac Gift card',
      description: 'Fashion & accessories',
      cta: 'Ready for a new outfit?',
      logo: '../assets/assets_and_code_for_selection_part/hm_logo.png',
      product: '../assets/assets_and_code_for_selection_part/hm_product.png',
      bannerColor: '#000000'
    },
    {
      brand: 'Philips',
      name: 'Sonic Toothbrush',
      description: 'Philips Sonicare 7100',
      price: '199,99 \u20ac',
      logo: '../assets/assets_and_code_for_selection_part/philips_logo.png',
      product: '../assets/assets_and_code_for_selection_part/philips_product.png',
      bannerColor: '#095ed3'
    },
    {
      brand: 'EIS',
      name: '150 \u20ac Gift card',
      description: 'Wellness & intimacy',
      cta: 'It\u2019s time to treat yourself!',
      logo: '../assets/assets_and_code_for_selection_part/Eis-logo.png',
      product: '../assets/assets_and_code_for_selection_part/eis_product.png',
      bannerColor: '#f4d9c6'
    }
  ]
};
