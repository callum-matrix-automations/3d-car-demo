export const SCENES = [
  { id: 'auto-studio', label: 'Auto Studio' },
  { id: 'fashion', label: 'Fashion' },
]

export const CAR_MODELS = [
  {
    id: 'ferrari',
    name: 'Ferrari',
    subtitle: 'Italian Performance Sports Car',
    path: '/models/ferrari.glb',
    price: '$350,000',
    specs: [
      {
        id: 'engine',
        icon: '⚡',
        label: 'Engine',
        value: '3.9L Twin-Turbo V8',
        description: '710 horsepower from a hand-assembled 3.9-litre twin-turbocharged V8. Each engine is signed by the master builder who crafted it in Maranello.',
        cameraAngle: { pos: [9, 4, 12], lookAt: [0, 1.5, 0] },
      },
      {
        id: 'performance',
        icon: '◈',
        label: 'Performance',
        value: '0-60 in 2.9s · 211 MPH',
        description: 'Side-slip angle control, magnetorheological dampers, and an electronic differential deliver track-ready precision with road-car refinement.',
        cameraAngle: { pos: [-12, 3.5, 6], lookAt: [0, 1.5, 0] },
      },
      {
        id: 'interior',
        icon: '✦',
        label: 'Interior',
        value: 'Full Leather · Carbon Fibre',
        description: 'Hand-stitched Poltrona Frau leather, carbon fibre racing seats, and a 16" curved digital cockpit display. Every surface is finished by artisans in Modena.',
        cameraAngle: { pos: [4, 6, 4], lookAt: [0, 3, 0] },
      },
      {
        id: 'design',
        icon: '⬡',
        label: 'Design',
        value: 'Active Aero · Ceramic Brakes',
        description: 'Wind-tunnel sculpted bodywork with active aerodynamic surfaces. Carbon ceramic brakes deliver fade-free stopping from any speed.',
        cameraAngle: { pos: [0, 4, -12], lookAt: [0, 1.5, 0] },
      },
    ],
  },
  {
    id: 'car',
    name: 'Revuelto',
    subtitle: 'Lamborghini V12 Hybrid Supercar',
    path: '/models/car.glb',
    price: '$608,000',
    specs: [
      {
        id: 'engine',
        icon: '⚡',
        label: 'Powertrain',
        value: '6.5L V12 + 3 Electric Motors',
        description: '1,001 combined horsepower from a naturally-aspirated V12 mated to three electric motors. The last Lamborghini V12 ever made, and the most powerful.',
        cameraAngle: { pos: [9, 4, 12], lookAt: [0, 1.5, 0] },
      },
      {
        id: 'performance',
        icon: '◈',
        label: 'Performance',
        value: '0-60 in 2.5s · 217 MPH',
        description: 'All-wheel drive with torque vectoring across all four wheels. 8-speed dual-clutch transmission delivers seamless power delivery.',
        cameraAngle: { pos: [-12, 3.5, 6], lookAt: [0, 1.5, 0] },
      },
      {
        id: 'interior',
        icon: '✦',
        label: 'Interior',
        value: 'Alcantara · Forged Composite',
        description: 'Fighter-jet inspired cockpit with three digital displays, Alcantara-wrapped surfaces, and Lamborghini\'s patented forged composite technology.',
        cameraAngle: { pos: [4, 6, 4], lookAt: [0, 3, 0] },
      },
      {
        id: 'design',
        icon: '⬡',
        label: 'Design',
        value: 'Y-Motif · Active Cooling',
        description: 'Lamborghini\'s signature Y-design language with functional air intakes, active cooling vents, and a full carbon fibre monocoque chassis.',
        cameraAngle: { pos: [0, 4, -12], lookAt: [0, 1.5, 0] },
      },
    ],
  },
]

export const FASHION_INFO = {
  name: 'Collection',
  subtitle: 'Luxury Leather Handbags',
}

export const HANDBAGS = [
  {
    id: 'classic',
    name: 'The Classic',
    tagline: 'Timeless Elegance',
    price: '$2,850',
    description: 'Hand-stitched from full-grain Italian calfskin, the Classic embodies understated luxury. Each piece is individually numbered and finished with palladium hardware.',
    material: 'Italian Calfskin',
    dimensions: '28 × 20 × 12 cm',
    origin: 'Handcrafted in Florence',
    model: '/models/handbag-light.glb',
    position: [-2, 0, 0],
    cameraOffset: [-2, 2, 4],
  },
  {
    id: 'noir',
    name: 'The Noir',
    tagline: 'Dark Sophistication',
    price: '$3,200',
    description: 'Crafted from rare midnight-black lambskin with hand-painted edges. The Noir features an architectural silhouette with brushed gold accents and a signature lock closure.',
    material: 'French Lambskin',
    dimensions: '30 × 22 × 14 cm',
    origin: 'Atelier Paris',
    model: '/models/handbag-dark.glb',
    position: [2, 0, 0],
    cameraOffset: [2, 2, 4],
  },
]
