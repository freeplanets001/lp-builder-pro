import { useState, useRef, useCallback, useEffect } from 'react';
import { Sparkles, LayoutGrid, CreditCard, HelpCircle, MousePointerClick, Mail, PanelBottom, Trash2, Copy, Eye, Pencil, Monitor, Tablet, Smartphone, Download, ChevronDown, Check, Image, Video, Quote, Users, BarChart3, Clock, Palette, Plus, X, Layers, Zap, Shield, Heart, Star, Target, TrendingUp, Award, ChevronRight, Minus, Move, Upload, FolderOpen, ChevronUp, Type, Box, Settings, Sliders, Code, Search, Globe, Undo, Redo, Save, Grid, AlignLeft, AlignCenter, AlignRight, Maximize2, RotateCcw, Wand2, Layout, Columns, MousePointer, Play, Square, Circle, ArrowRight, ExternalLink } from 'lucide-react';

// ===== TYPES =====
type SectionType = 'hero' | 'features' | 'pricing' | 'testimonials' | 'stats' | 'video' | 'gallery' | 'logos' | 'faq' | 'cta' | 'contact' | 'footer' | 'divider' | 'spacer' | 'custom';

interface SectionStyles {
  backgroundColor: string;
  textColor: string;
  padding: string;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  backgroundType: string;
  gradientFrom: string;
  gradientTo: string;
  gradientDirection: number;
  backgroundImage: string;
  backgroundSize: string;
  backgroundPosition: string;
  backgroundOverlay: number;
  fontFamily: string;
  fontSize: number;
  headingSize: number;
  lineHeight: number;
  letterSpacing: number;
  textAlign: string;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  boxShadow: string;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowColor: string;
  animation: string;
  animationDuration: number;
  animationDelay: number;
  maxWidth: string;
  columns: number;
  gap: number;
  customCSS: string;
}

interface ButtonStyles {
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  paddingX: number;
  paddingY: number;
  fontSize: number;
  fontWeight: string;
  borderWidth: number;
  borderColor: string;
  shadow: string;
  hoverEffect: string;
}

interface Section {
  id: string;
  type: SectionType;
  content: any;
  styles: SectionStyles;
  buttonStyles?: ButtonStyles;
}

interface PageSettings {
  title: string;
  description: string;
  favicon: string;
  ogImage: string;
  themeColor: string;
  fontPrimary: string;
  fontSecondary: string;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  customHead: string;
  customCSS: string;
}

// ===== CONSTANTS =====
const FONTS = [
  { name: 'Noto Sans JP', value: "'Noto Sans JP', sans-serif" },
  { name: 'Inter', value: "'Inter', sans-serif" },
  { name: 'Poppins', value: "'Poppins', sans-serif" },
  { name: 'Roboto', value: "'Roboto', sans-serif" },
  { name: 'Open Sans', value: "'Open Sans', sans-serif" },
  { name: 'Montserrat', value: "'Montserrat', sans-serif" },
  { name: 'Playfair Display', value: "'Playfair Display', serif" },
  { name: 'Lora', value: "'Lora', serif" },
  { name: 'Zen Kaku Gothic', value: "'Zen Kaku Gothic New', sans-serif" },
  { name: 'M PLUS 1p', value: "'M PLUS 1p', sans-serif" },
];

const ANIMATIONS = [
  { name: 'なし', value: 'none' },
  { name: 'フェードイン', value: 'fadeIn' },
  { name: '上からスライド', value: 'slideDown' },
  { name: '下からスライド', value: 'slideUp' },
  { name: '左からスライド', value: 'slideLeft' },
  { name: '右からスライド', value: 'slideRight' },
  { name: 'ズームイン', value: 'zoomIn' },
  { name: 'ズームアウト', value: 'zoomOut' },
  { name: 'バウンス', value: 'bounce' },
  { name: '回転', value: 'rotate' },
  { name: 'フリップ', value: 'flip' },
  { name: 'パルス', value: 'pulse' },
];

const BUTTON_SHAPES = [
  { name: '角丸', value: 8 },
  { name: 'ピル型', value: 9999 },
  { name: '角形', value: 0 },
  { name: '丸め', value: 16 },
];

const HOVER_EFFECTS = [
  { name: 'なし', value: 'none' },
  { name: '浮き上がり', value: 'lift' },
  { name: '拡大', value: 'scale' },
  { name: '光る', value: 'glow' },
  { name: '色反転', value: 'invert' },
  { name: 'シャドウ', value: 'shadow' },
];

const iconLibrary: Record<string, any> = { Zap, Shield, Heart, Star, Target, TrendingUp, Award, Users, BarChart3, Clock, Sparkles, Check, Mail, CreditCard, Globe, Play, Square, Circle, ArrowRight, ExternalLink };

// ===== DEFAULT VALUES =====
const getDefaultStyles = (type: SectionType): SectionStyles => ({
  backgroundColor: ['cta', 'hero', 'footer', 'stats'].includes(type) ? '#0f172a' : '#ffffff',
  textColor: ['cta', 'hero', 'footer', 'stats'].includes(type) ? '#ffffff' : '#1f2937',
  padding: 'custom',
  paddingTop: type === 'hero' ? 120 : 80,
  paddingBottom: type === 'hero' ? 120 : 80,
  paddingLeft: 24,
  paddingRight: 24,
  backgroundType: 'solid',
  gradientFrom: '#0ea5e9',
  gradientTo: '#8b5cf6',
  gradientDirection: 135,
  backgroundImage: '',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundOverlay: 0.5,
  fontFamily: "'Noto Sans JP', sans-serif",
  fontSize: 16,
  headingSize: 48,
  lineHeight: 1.6,
  letterSpacing: 0,
  textAlign: 'center',
  borderWidth: 0,
  borderColor: '#e5e7eb',
  borderRadius: 0,
  boxShadow: 'none',
  shadowX: 0,
  shadowY: 4,
  shadowBlur: 20,
  shadowSpread: 0,
  shadowColor: 'rgba(0,0,0,0.1)',
  animation: 'fadeIn',
  animationDuration: 0.6,
  animationDelay: 0,
  maxWidth: '1200px',
  columns: type === 'features' ? 3 : type === 'pricing' ? 3 : 1,
  gap: 32,
  customCSS: '',
});

const getDefaultButtonStyles = (): ButtonStyles => ({
  backgroundColor: '#0ea5e9',
  textColor: '#ffffff',
  borderRadius: 8,
  paddingX: 32,
  paddingY: 16,
  fontSize: 16,
  fontWeight: '600',
  borderWidth: 0,
  borderColor: '#0ea5e9',
  shadow: '0 4px 14px rgba(14, 165, 233, 0.4)',
  hoverEffect: 'lift',
});

const getDefaultContent = (type: SectionType): any => {
  const defaults: Record<SectionType, any> = {
    hero: { title: 'あなたのビジネスを\n次のレベルへ', subtitle: 'シンプルで使いやすいサービスで、ビジネスの成長を加速させます', ctaText: '今すぐ始める', ctaLink: '#contact', ctaIcon: 'ArrowRight', secondaryCtaText: '詳しく見る', secondaryCtaLink: '#features', backgroundImage: '', showOverlay: true },
    features: { title: '主な特徴', subtitle: '私たちのサービスが選ばれる3つの理由', features: [
      { id: '1', icon: 'Zap', title: '圧倒的な速度', description: '最新のテクノロジーで驚くほど高速なパフォーマンスを実現' },
      { id: '2', icon: 'Shield', title: '万全のセキュリティ', description: 'エンタープライズレベルのセキュリティで大切なデータを保護' },
      { id: '3', icon: 'Heart', title: '直感的なUI', description: '誰でも簡単に使える洗練されたインターフェース' },
    ]},
    pricing: { title: '料金プラン', subtitle: 'シンプルで透明性のある価格設定', plans: [
      { id: '1', name: 'スターター', price: '¥0', period: '/月', description: '個人利用に最適', features: ['基本機能すべて', 'メールサポート', '5GBストレージ'], ctaText: '無料で始める', isPopular: false },
      { id: '2', name: 'プロフェッショナル', price: '¥2,980', period: '/月', description: 'チームでの利用に', features: ['すべての機能', '優先サポート', '100GBストレージ', 'API アクセス', 'カスタム連携'], ctaText: '14日間無料体験', isPopular: true },
      { id: '3', name: 'エンタープライズ', price: 'お問い合わせ', period: '', description: '大規模組織向け', features: ['無制限すべて', '専任サポート', 'SLA保証', 'オンプレミス対応'], ctaText: 'お問い合わせ', isPopular: false },
    ]},
    testimonials: { title: 'お客様の声', subtitle: '実際にご利用いただいているお客様からの声', testimonials: [
      { id: '1', name: '田中 太郎', role: '代表取締役', company: '株式会社イノベーション', content: '導入後、業務効率が3倍に向上しました。チーム全員が満足しています。', avatar: '', rating: 5 },
      { id: '2', name: '鈴木 花子', role: 'マーケティング部長', company: 'テックスタートアップ株式会社', content: 'UIが直感的で、導入初日から全員が使いこなせました。サポートも素晴らしい。', avatar: '', rating: 5 },
    ]},
    stats: { title: '', subtitle: '', stats: [
      { id: '1', value: '10,000+', label: 'アクティブユーザー', icon: 'Users' },
      { id: '2', value: '99.9%', label: '稼働率', icon: 'TrendingUp' },
      { id: '3', value: '50+', label: '導入企業', icon: 'Award' },
      { id: '4', value: '24/7', label: 'サポート体制', icon: 'Clock' },
    ]},
    video: { title: 'サービス紹介', subtitle: '3分でわかる私たちのサービス', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', aspectRatio: '16/9' },
    gallery: { title: 'ギャラリー', subtitle: '', images: [{ id: '1', url: '', caption: '画像1' }, { id: '2', url: '', caption: '画像2' }, { id: '3', url: '', caption: '画像3' }], columns: 3, gap: 16, aspectRatio: '4/3' },
    logos: { title: '導入企業', subtitle: '多くの企業様にご利用いただいています', logos: [{ id: '1', name: 'Company A', url: '' }, { id: '2', name: 'Company B', url: '' }, { id: '3', name: 'Company C', url: '' }, { id: '4', name: 'Company D', url: '' }, { id: '5', name: 'Company E', url: '' }], grayscale: true },
    faq: { title: 'よくある質問', subtitle: 'お客様からよくいただく質問をまとめました', items: [
      { id: '1', question: '無料プランでも全機能使えますか？', answer: '基本機能はすべてお使いいただけます。高度な分析機能やAPI連携は有料プランで提供しています。' },
      { id: '2', question: 'いつでも解約できますか？', answer: 'はい、いつでも解約可能です。解約後も契約期間終了まではご利用いただけます。' },
      { id: '3', question: 'データの移行はできますか？', answer: 'はい、他サービスからのデータ移行をサポートしています。専門チームがお手伝いします。' },
    ]},
    cta: { title: '今すぐ始めましょう', subtitle: '無料で始められます。クレジットカード不要。', buttonText: '無料で始める', buttonLink: '#', buttonIcon: 'ArrowRight', secondaryText: 'お問い合わせ', secondaryLink: '#contact' },
    contact: { title: 'お問い合わせ', subtitle: 'お気軽にご相談ください', fields: [
      { id: '1', type: 'text', label: 'お名前', placeholder: '山田 太郎', required: true, width: 'half' },
      { id: '2', type: 'email', label: 'メールアドレス', placeholder: 'example@email.com', required: true, width: 'half' },
      { id: '3', type: 'select', label: 'お問い合わせ種別', placeholder: '選択してください', options: ['サービスについて', '料金について', 'その他'], required: true, width: 'full' },
      { id: '4', type: 'textarea', label: 'メッセージ', placeholder: 'お問い合わせ内容をご記入ください', required: true, width: 'full' },
    ], submitText: '送信する', submitIcon: 'ArrowRight' },
    footer: { companyName: 'Your Company', description: 'ビジネスの成長をテクノロジーでサポートします', logo: '', links: [
      { id: '1', title: 'プロダクト', items: [{ label: '機能', url: '#' }, { label: '料金', url: '#' }, { label: '導入事例', url: '#' }] },
      { id: '2', title: 'サポート', items: [{ label: 'ヘルプセンター', url: '#' }, { label: 'お問い合わせ', url: '#' }, { label: 'ステータス', url: '#' }] },
      { id: '3', title: '会社情報', items: [{ label: '会社概要', url: '#' }, { label: '採用情報', url: '#' }, { label: 'ブログ', url: '#' }] },
    ], social: [{ platform: 'twitter', url: '#' }, { platform: 'facebook', url: '#' }, { platform: 'instagram', url: '#' }], copyright: '© 2026 Your Company. All rights reserved.' },
    divider: { style: 'line', color: '#e5e7eb', height: 1, width: 100, pattern: 'solid' },
    spacer: { height: 80 },
    custom: { html: '<div style="padding: 40px; text-align: center;"><h2>カスタムセクション</h2><p>HTMLを自由に編集できます</p></div>' },
  };
  return defaults[type];
};

const defaultPageSettings: PageSettings = {
  title: 'My Landing Page',
  description: 'Created with LP Builder Pro',
  favicon: '',
  ogImage: '',
  themeColor: '#0ea5e9',
  fontPrimary: "'Noto Sans JP', sans-serif",
  fontSecondary: "'Inter', sans-serif",
  colorPrimary: '#0ea5e9',
  colorSecondary: '#8b5cf6',
  colorAccent: '#f59e0b',
  customHead: '',
  customCSS: '',
};

// ===== COMPONENTS =====
const DynamicIcon = ({ name, size = 24, style = {} }: { name: string; size?: number; style?: React.CSSProperties }) => {
  const IconComponent = iconLibrary[name] || Sparkles;
  return <IconComponent size={size} style={style} />;
};

const ImageUploader = ({ value, onChange, label = "画像" }: { value: string; onChange: (v: string) => void; label?: string }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const handleFile = (file: File) => { if (file?.type.startsWith('image/')) { const r = new FileReader(); r.onload = (e) => onChange(e.target?.result as string); r.readAsDataURL(file); } };
  return (
    <div className="mb-4">
      <label className="block text-gray-400 text-xs mb-2 uppercase tracking-wide">{label}</label>
      <div onClick={() => inputRef.current?.click()} onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${isDragging ? 'border-sky-500 bg-sky-500/10' : 'border-gray-600 hover:border-gray-500'}`}>
        {value ? (<div className="relative inline-block"><img src={value} alt="Preview" className="max-w-full max-h-24 rounded object-cover" /><button onClick={(e) => { e.stopPropagation(); onChange(''); }} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button></div>) : (<div className="text-gray-500"><Upload size={20} className="mx-auto mb-2" /><p className="text-xs">クリックまたはドラッグ</p></div>)}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={(e) => e.target.files && handleFile(e.target.files[0])} className="hidden" />
      <input type="text" value={typeof value === 'string' && !value.startsWith('data:') ? value : ''} onChange={(e) => onChange(e.target.value)} placeholder="または画像URLを入力" className="w-full mt-2 px-3 py-2 bg-slate-700 border-0 rounded text-white text-xs" />
    </div>
  );
};

const SliderInput = ({ label, value, onChange, min = 0, max = 100, step = 1, unit = '' }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; unit?: string }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <label className="text-gray-400 text-xs uppercase tracking-wide">{label}</label>
      <span className="text-white text-xs font-mono">{value}{unit}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500" />
  </div>
);

const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="mb-4">
    <label className="block text-gray-400 text-xs mb-2 uppercase tracking-wide">{label}</label>
    <div className="flex gap-2">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 px-3 py-2 bg-slate-700 border-0 rounded text-white text-sm font-mono" />
    </div>
  </div>
);

const SelectInput = ({ label, value, onChange, options }: { label: string; value: string | number; onChange: (v: any) => void; options: { name: string; value: any }[] }) => (
  <div className="mb-4">
    <label className="block text-gray-400 text-xs mb-2 uppercase tracking-wide">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 bg-slate-700 border-0 rounded text-white text-sm">
      {options.map((o) => <option key={o.value} value={o.value}>{o.name}</option>)}
    </select>
  </div>
);

const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${active ? 'bg-sky-600 text-white' : 'text-gray-400 hover:bg-slate-700'}`}>{children}</button>
);

// ===== SECTION COMPONENTS =====
const sectionMeta: Record<SectionType, { label: string; Icon: any }> = {
  hero: { label: 'ヒーロー', Icon: Sparkles },
  features: { label: '特徴', Icon: LayoutGrid },
  pricing: { label: '料金', Icon: CreditCard },
  testimonials: { label: 'お客様の声', Icon: Quote },
  stats: { label: '実績', Icon: BarChart3 },
  video: { label: '動画', Icon: Video },
  gallery: { label: 'ギャラリー', Icon: Image },
  logos: { label: 'ロゴ', Icon: Layers },
  faq: { label: 'FAQ', Icon: HelpCircle },
  cta: { label: 'CTA', Icon: MousePointerClick },
  contact: { label: 'フォーム', Icon: Mail },
  footer: { label: 'フッター', Icon: PanelBottom },
  divider: { label: '区切り', Icon: Minus },
  spacer: { label: 'スペース', Icon: Move },
  custom: { label: 'カスタム', Icon: Code },
};

const HeroSection = ({ content, styles, buttonStyles, isPreview, onUpdate }: any) => {
  const bgStyle: React.CSSProperties = styles.backgroundType === 'gradient' 
    ? { background: `linear-gradient(${styles.gradientDirection}deg, ${styles.gradientFrom}, ${styles.gradientTo})` }
    : styles.backgroundType === 'image' && (content.backgroundImage || styles.backgroundImage)
    ? { backgroundImage: `url(${content.backgroundImage || styles.backgroundImage})`, backgroundSize: styles.backgroundSize, backgroundPosition: styles.backgroundPosition }
    : { backgroundColor: styles.backgroundColor };

  const btnStyle: React.CSSProperties = {
    backgroundColor: buttonStyles?.backgroundColor || '#0ea5e9',
    color: buttonStyles?.textColor || '#ffffff',
    borderRadius: buttonStyles?.borderRadius || 8,
    padding: `${buttonStyles?.paddingY || 16}px ${buttonStyles?.paddingX || 32}px`,
    fontSize: buttonStyles?.fontSize || 16,
    fontWeight: buttonStyles?.fontWeight || '600',
    border: buttonStyles?.borderWidth ? `${buttonStyles.borderWidth}px solid ${buttonStyles.borderColor}` : 'none',
    boxShadow: buttonStyles?.shadow || 'none',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  return (
    <div style={{ position: 'relative', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...bgStyle }}>
      {content.showOverlay && styles.backgroundType === 'image' && <div style={{ position: 'absolute', inset: 0, backgroundColor: `rgba(0,0,0,${styles.backgroundOverlay})` }} />}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: styles.maxWidth, margin: '0 auto', textAlign: styles.textAlign as any, padding: '2rem', fontFamily: styles.fontFamily }}>
        <h1 style={{ fontSize: `clamp(2rem, 5vw, ${styles.headingSize}px)`, fontWeight: 'bold', marginBottom: '1.5rem', lineHeight: 1.1, whiteSpace: 'pre-line', letterSpacing: styles.letterSpacing }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => onUpdate({ ...content, title: e.currentTarget.textContent })}>{content.title}</h1>
        <p style={{ fontSize: `clamp(1rem, 2vw, ${styles.fontSize * 1.25}px)`, opacity: 0.9, marginBottom: '2.5rem', maxWidth: '700px', margin: styles.textAlign === 'center' ? '0 auto 2.5rem' : '0 0 2.5rem', lineHeight: styles.lineHeight }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => onUpdate({ ...content, subtitle: e.currentTarget.textContent })}>{content.subtitle}</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: styles.textAlign === 'center' ? 'center' : styles.textAlign === 'right' ? 'flex-end' : 'flex-start' }}>
          <a href={content.ctaLink} style={btnStyle}>{content.ctaText} {content.ctaIcon && <DynamicIcon name={content.ctaIcon} size={20} />}</a>
          {content.secondaryCtaText && <a href={content.secondaryCtaLink} style={{ ...btnStyle, backgroundColor: 'transparent', color: 'inherit', border: '2px solid currentColor', boxShadow: 'none' }}>{content.secondaryCtaText}</a>}
        </div>
      </div>
    </div>
  );
};

const FeaturesSection = ({ content, styles, isPreview, onUpdate }: any) => {
  const updateFeature = (id: string, u: any) => onUpdate({ ...content, features: content.features.map((f: any) => f.id === id ? { ...f, ...u } : f) });
  const addFeature = () => onUpdate({ ...content, features: [...content.features, { id: Date.now().toString(), icon: 'Star', title: '新機能', description: '説明を入力' }] });
  const removeFeature = (id: string) => onUpdate({ ...content, features: content.features.filter((f: any) => f.id !== id) });

  return (
    <div style={{ maxWidth: styles.maxWidth, margin: '0 auto', fontFamily: styles.fontFamily }}>
      <div style={{ textAlign: styles.textAlign as any, marginBottom: '3rem' }}>
        <h2 style={{ fontSize: styles.headingSize * 0.75, fontWeight: 'bold', marginBottom: '1rem' }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => onUpdate({ ...content, title: e.currentTarget.textContent })}>{content.title}</h2>
        <p style={{ opacity: 0.7, maxWidth: '600px', margin: styles.textAlign === 'center' ? '0 auto' : '0', lineHeight: styles.lineHeight }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => onUpdate({ ...content, subtitle: e.currentTarget.textContent })}>{content.subtitle}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${styles.columns}, 1fr)`, gap: styles.gap }}>
        {content.features.map((f: any) => (
          <div key={f.id} style={{ position: 'relative', textAlign: 'center', padding: '2rem', borderRadius: styles.borderRadius || 16, backgroundColor: styles.textColor === '#ffffff' ? 'rgba(255,255,255,0.05)' : 'rgba(14, 165, 233, 0.05)', border: styles.borderWidth ? `${styles.borderWidth}px solid ${styles.borderColor}` : 'none' }}>
            {!isPreview && <button onClick={() => removeFeature(f.id)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500"><X size={14} /></button>}
            <div style={{ width: '4rem', height: '4rem', margin: '0 auto 1.5rem', background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><DynamicIcon name={f.icon} size={28} /></div>
            <h3 style={{ fontSize: styles.fontSize * 1.25, fontWeight: 600, marginBottom: '0.75rem' }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => updateFeature(f.id, { title: e.currentTarget.textContent })}>{f.title}</h3>
            <p style={{ opacity: 0.7, lineHeight: styles.lineHeight, fontSize: styles.fontSize }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => updateFeature(f.id, { description: e.currentTarget.textContent })}>{f.description}</p>
          </div>
        ))}
      </div>
      {!isPreview && <div style={{ textAlign: 'center', marginTop: '2rem' }}><button onClick={addFeature} className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-sky-500 hover:text-sky-500"><Plus size={18} /> 追加</button></div>}
    </div>
  );
};

const StatsSection = ({ content, styles, isPreview, onUpdate }: any) => {
  const updateStat = (id: string, u: any) => onUpdate({ ...content, stats: content.stats.map((s: any) => s.id === id ? { ...s, ...u } : s) });
  return (
    <div style={{ maxWidth: styles.maxWidth, margin: '0 auto', fontFamily: styles.fontFamily }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${content.stats.length}, 1fr)`, gap: styles.gap }}>
        {content.stats.map((s: any) => (
          <div key={s.id} style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: styles.headingSize * 0.8, fontWeight: 'bold', marginBottom: '0.5rem', background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => updateStat(s.id, { value: e.currentTarget.textContent })}>{s.value}</div>
            <div style={{ opacity: 0.7, fontSize: styles.fontSize }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => updateStat(s.id, { label: e.currentTarget.textContent })}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PricingSection = ({ content, styles, buttonStyles }: any) => {
  const btnStyle: React.CSSProperties = { backgroundColor: buttonStyles?.backgroundColor || '#0ea5e9', color: buttonStyles?.textColor || '#ffffff', borderRadius: buttonStyles?.borderRadius || 8, padding: `${buttonStyles?.paddingY || 12}px ${buttonStyles?.paddingX || 24}px`, fontSize: buttonStyles?.fontSize || 14, fontWeight: buttonStyles?.fontWeight || '600', border: 'none', width: '100%', cursor: 'pointer' };
  return (
    <div style={{ maxWidth: styles.maxWidth, margin: '0 auto', fontFamily: styles.fontFamily }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}><h2 style={{ fontSize: styles.headingSize * 0.75, fontWeight: 'bold', marginBottom: '1rem' }}>{content.title}</h2><p style={{ opacity: 0.7 }}>{content.subtitle}</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${styles.columns}, 1fr)`, gap: styles.gap, alignItems: 'start' }}>
        {content.plans.map((p: any) => (
          <div key={p.id} style={{ padding: '2.5rem', borderRadius: styles.borderRadius || 24, position: 'relative', background: p.isPopular ? 'linear-gradient(135deg, #0ea5e9, #8b5cf6)' : styles.textColor === '#ffffff' ? 'rgba(255,255,255,0.05)' : '#ffffff', color: p.isPopular ? 'white' : 'inherit', boxShadow: p.isPopular ? '0 25px 50px -12px rgba(14,165,233,0.4)' : styles.boxShadow !== 'none' ? `${styles.shadowX}px ${styles.shadowY}px ${styles.shadowBlur}px ${styles.shadowSpread}px ${styles.shadowColor}` : '0 4px 6px -1px rgba(0,0,0,0.1)', transform: p.isPopular ? 'scale(1.05)' : 'none', border: !p.isPopular && styles.textColor !== '#ffffff' ? '1px solid #e5e7eb' : 'none' }}>
            {p.isPopular && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', padding: '0.25rem 1rem', backgroundColor: '#fbbf24', color: '#1f2937', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>人気</div>}
            <h3 style={{ fontSize: styles.fontSize * 1.5, fontWeight: 'bold', marginBottom: '0.5rem' }}>{p.name}</h3>
            <p style={{ fontSize: styles.fontSize * 0.875, opacity: 0.8, marginBottom: '1.5rem' }}>{p.description}</p>
            <div style={{ marginBottom: '2rem' }}><span style={{ fontSize: styles.headingSize * 0.6, fontWeight: 'bold' }}>{p.price}</span><span style={{ opacity: 0.7 }}>{p.period}</span></div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>{p.features.map((f: string, i: number) => <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', fontSize: styles.fontSize }}><Check size={16} style={{ color: p.isPopular ? 'white' : '#0ea5e9', flexShrink: 0 }} /> {f}</li>)}</ul>
            <button style={{ ...btnStyle, backgroundColor: p.isPopular ? 'white' : btnStyle.backgroundColor, color: p.isPopular ? '#0ea5e9' : btnStyle.color }}>{p.ctaText}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const TestimonialsSection = ({ content, styles, isPreview, onUpdate }: any) => {
  const updateT = (id: string, u: any) => onUpdate({ ...content, testimonials: content.testimonials.map((t: any) => t.id === id ? { ...t, ...u } : t) });
  return (
    <div style={{ maxWidth: styles.maxWidth, margin: '0 auto', fontFamily: styles.fontFamily }}>
      <div style={{ textAlign: styles.textAlign as any, marginBottom: '3rem' }}><h2 style={{ fontSize: styles.headingSize * 0.75, fontWeight: 'bold', marginBottom: '1rem' }}>{content.title}</h2><p style={{ opacity: 0.7 }}>{content.subtitle}</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(content.testimonials.length, 2)}, 1fr)`, gap: styles.gap }}>
        {content.testimonials.map((t: any) => (
          <div key={t.id} style={{ backgroundColor: styles.textColor === '#ffffff' ? 'rgba(255,255,255,0.05)' : '#f8fafc', padding: '2rem', borderRadius: styles.borderRadius || 16 }}>
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>{[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < t.rating ? '#fbbf24' : 'none'} color={i < t.rating ? '#fbbf24' : '#d1d5db'} />)}</div>
            <p style={{ fontSize: styles.fontSize * 1.125, lineHeight: styles.lineHeight, marginBottom: '1.5rem' }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => updateT(t.id, { content: e.currentTarget.textContent })}>{t.content}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>{t.avatar ? <img src={t.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : t.name.charAt(0)}</div>
              <div><div style={{ fontWeight: 600 }}>{t.name}</div><div style={{ fontSize: styles.fontSize * 0.875, opacity: 0.7 }}>{t.role}{t.company && ` / ${t.company}`}</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FAQSection = ({ content, styles, isPreview, onUpdate }: any) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const updateItem = (id: string, u: any) => onUpdate({ ...content, items: content.items.map((item: any) => item.id === id ? { ...item, ...u } : item) });
  const addItem = () => onUpdate({ ...content, items: [...content.items, { id: Date.now().toString(), question: '新しい質問', answer: '回答を入力してください' }] });
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: styles.fontFamily }}>
      <div style={{ textAlign: styles.textAlign as any, marginBottom: '3rem' }}><h2 style={{ fontSize: styles.headingSize * 0.75, fontWeight: 'bold', marginBottom: '1rem' }}>{content.title}</h2><p style={{ opacity: 0.7 }}>{content.subtitle}</p></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {content.items.map((item: any, idx: number) => (
          <div key={item.id} style={{ border: `1px solid ${styles.textColor === '#ffffff' ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`, borderRadius: styles.borderRadius || 16, overflow: 'hidden' }}>
            <button onClick={() => setOpenIdx(openIdx === idx ? null : idx)} style={{ width: '100%', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: openIdx === idx ? (styles.textColor === '#ffffff' ? 'rgba(255,255,255,0.05)' : '#f8fafc') : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'inherit', fontFamily: 'inherit' }}>
              <span style={{ fontWeight: 600, fontSize: styles.fontSize * 1.125 }} contentEditable={!isPreview} suppressContentEditableWarning onClick={(e) => e.stopPropagation()} onBlur={(e) => updateItem(item.id, { question: e.currentTarget.textContent })}>{item.question}</span>
              <ChevronDown size={20} style={{ flexShrink: 0, transform: openIdx === idx ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', opacity: 0.5 }} />
            </button>
            <div style={{ maxHeight: openIdx === idx ? '500px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease-out' }}>
              <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.8, lineHeight: styles.lineHeight, fontSize: styles.fontSize }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => updateItem(item.id, { answer: e.currentTarget.textContent })}>{item.answer}</div>
            </div>
          </div>
        ))}
      </div>
      {!isPreview && <div style={{ textAlign: 'center', marginTop: '2rem' }}><button onClick={addItem} className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-sky-500 hover:text-sky-500"><Plus size={18} /> 追加</button></div>}
    </div>
  );
};

const CTASection = ({ content, styles, buttonStyles, isPreview, onUpdate }: any) => {
  const btnStyle: React.CSSProperties = { backgroundColor: styles.textColor === '#ffffff' ? 'white' : buttonStyles?.backgroundColor || '#0ea5e9', color: styles.textColor === '#ffffff' ? '#0ea5e9' : buttonStyles?.textColor || '#ffffff', borderRadius: buttonStyles?.borderRadius || 8, padding: `${buttonStyles?.paddingY || 16}px ${buttonStyles?.paddingX || 32}px`, fontSize: buttonStyles?.fontSize || 18, fontWeight: buttonStyles?.fontWeight || '600', border: 'none', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' };
  return (
    <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', fontFamily: styles.fontFamily }}>
      <h2 style={{ fontSize: styles.headingSize * 0.75, fontWeight: 'bold', marginBottom: '1rem' }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => onUpdate({ ...content, title: e.currentTarget.textContent })}>{content.title}</h2>
      <p style={{ fontSize: styles.fontSize * 1.25, opacity: 0.9, marginBottom: '2.5rem' }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => onUpdate({ ...content, subtitle: e.currentTarget.textContent })}>{content.subtitle}</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href={content.buttonLink} style={btnStyle}>{content.buttonText} {content.buttonIcon && <DynamicIcon name={content.buttonIcon} size={20} />}</a>
        {content.secondaryText && <a href={content.secondaryLink} style={{ ...btnStyle, backgroundColor: 'transparent', color: 'inherit', border: '2px solid currentColor', boxShadow: 'none' }}>{content.secondaryText}</a>}
      </div>
    </div>
  );
};

const ContactSection = ({ content, styles, buttonStyles }: any) => {
  const btnStyle: React.CSSProperties = { backgroundColor: buttonStyles?.backgroundColor || '#0ea5e9', color: buttonStyles?.textColor || '#ffffff', borderRadius: buttonStyles?.borderRadius || 8, padding: `${buttonStyles?.paddingY || 16}px ${buttonStyles?.paddingX || 32}px`, fontSize: buttonStyles?.fontSize || 16, fontWeight: buttonStyles?.fontWeight || '600', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.875rem', border: styles.textColor === '#ffffff' ? '1px solid rgba(255,255,255,0.2)' : '2px solid #e5e7eb', borderRadius: styles.borderRadius || 12, backgroundColor: styles.textColor === '#ffffff' ? 'rgba(255,255,255,0.1)' : 'white', color: styles.textColor === '#ffffff' ? 'white' : '#1f2937', fontSize: styles.fontSize, fontFamily: styles.fontFamily, boxSizing: 'border-box' as const };
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: styles.fontFamily }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}><h2 style={{ fontSize: styles.headingSize * 0.75, fontWeight: 'bold', marginBottom: '1rem' }}>{content.title}</h2><p style={{ opacity: 0.7 }}>{content.subtitle}</p></div>
      <form onSubmit={(e) => e.preventDefault()} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {content.fields.map((f: any) => (
          <div key={f.id} style={{ gridColumn: f.width === 'full' ? '1 / -1' : 'auto' }}>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', fontSize: styles.fontSize }}>{f.label}{f.required && <span style={{ color: '#ef4444' }}> *</span>}</label>
            {f.type === 'textarea' ? <textarea placeholder={f.placeholder} rows={4} style={{ ...inputStyle, resize: 'none' }} /> :
             f.type === 'select' ? <select style={inputStyle}><option value="">{f.placeholder}</option>{f.options?.map((o: string) => <option key={o} value={o}>{o}</option>)}</select> :
             <input type={f.type} placeholder={f.placeholder} style={inputStyle} />}
          </div>
        ))}
        <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}><button type="submit" style={btnStyle}>{content.submitText} {content.submitIcon && <DynamicIcon name={content.submitIcon} size={20} />}</button></div>
      </form>
    </div>
  );
};

const FooterSection = ({ content, styles }: any) => (
  <div style={{ maxWidth: styles.maxWidth, margin: '0 auto', fontFamily: styles.fontFamily }}>
    <div style={{ display: 'grid', gridTemplateColumns: `2fr repeat(${content.links.length}, 1fr)`, gap: '3rem', marginBottom: '3rem' }}>
      <div>
        <div style={{ width: '3rem', height: '3rem', background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', marginBottom: '1rem' }}>{content.companyName?.charAt(0) || 'L'}</div>
        <p style={{ opacity: 0.7, lineHeight: styles.lineHeight, marginBottom: '1.5rem' }}>{content.description}</p>
        <div style={{ display: 'flex', gap: '1rem' }}>{content.social?.map((s: any, i: number) => <a key={i} href={s.url} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: styles.textColor === '#ffffff' ? 'rgba(255,255,255,0.1)' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit', opacity: 0.7 }}><Globe size={18} /></a>)}</div>
      </div>
      {content.links.map((g: any) => <div key={g.id}><h4 style={{ fontWeight: 600, marginBottom: '1.5rem', fontSize: styles.fontSize }}>{g.title}</h4><ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>{g.items.map((i: any, idx: number) => <li key={idx} style={{ marginBottom: '0.75rem' }}><a href={i.url} style={{ opacity: 0.7, textDecoration: 'none', color: 'inherit', fontSize: styles.fontSize * 0.9375 }}>{i.label}</a></li>)}</ul></div>)}
    </div>
    <div style={{ borderTop: `1px solid ${styles.textColor === '#ffffff' ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`, paddingTop: '2rem', textAlign: 'center' }}><p style={{ opacity: 0.7, fontSize: styles.fontSize * 0.875 }}>{content.copyright}</p></div>
  </div>
);

const VideoSection = ({ content, styles, isPreview, onUpdate }: any) => (
  <div style={{ maxWidth: '900px', margin: '0 auto', fontFamily: styles.fontFamily }}>
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}><h2 style={{ fontSize: styles.headingSize * 0.75, fontWeight: 'bold', marginBottom: '1rem' }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => onUpdate({ ...content, title: e.currentTarget.textContent })}>{content.title}</h2><p style={{ opacity: 0.7 }}>{content.subtitle}</p></div>
    <div style={{ position: 'relative', paddingBottom: content.aspectRatio === '16/9' ? '56.25%' : content.aspectRatio === '4/3' ? '75%' : '56.25%', borderRadius: styles.borderRadius || 16, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
      <iframe src={content.videoUrl} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
    </div>
    {!isPreview && <input type="text" value={content.videoUrl} onChange={(e) => onUpdate({ ...content, videoUrl: e.target.value })} placeholder="YouTube URL" className="w-full mt-4 px-4 py-3 border rounded-lg" style={{ boxSizing: 'border-box' }} />}
  </div>
);

const GallerySection = ({ content, styles, isPreview, onUpdate }: any) => {
  const updateImg = (id: string, u: any) => onUpdate({ ...content, images: content.images.map((img: any) => img.id === id ? { ...img, ...u } : img) });
  const addImg = () => onUpdate({ ...content, images: [...content.images, { id: Date.now().toString(), url: '', caption: '新しい画像' }] });
  return (
    <div style={{ maxWidth: styles.maxWidth, margin: '0 auto', fontFamily: styles.fontFamily }}>
      {content.title && <div style={{ textAlign: 'center', marginBottom: '2rem' }}><h2 style={{ fontSize: styles.headingSize * 0.75, fontWeight: 'bold' }}>{content.title}</h2></div>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${content.columns || 3}, 1fr)`, gap: content.gap || 16 }}>
        {content.images.map((img: any) => (
          <div key={img.id} style={{ position: 'relative', aspectRatio: content.aspectRatio || '4/3', borderRadius: styles.borderRadius || 12, overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
            {img.url ? <img src={img.url} alt={img.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}><Image size={32} /><span style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>{img.caption}</span></div>}
            {!isPreview && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.7)' }}><input type="text" value={img.url} onChange={(e) => updateImg(img.id, { url: e.target.value })} placeholder="画像URL" className="w-full px-2 py-1 text-xs rounded border-0" style={{ boxSizing: 'border-box' }} /></div>}
          </div>
        ))}
      </div>
      {!isPreview && <div style={{ textAlign: 'center', marginTop: '2rem' }}><button onClick={addImg} className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-sky-500 hover:text-sky-500"><Plus size={18} /> 追加</button></div>}
    </div>
  );
};

const LogosSection = ({ content, styles }: any) => (
  <div style={{ maxWidth: styles.maxWidth, margin: '0 auto', fontFamily: styles.fontFamily }}>
    {content.title && <h2 style={{ fontSize: styles.fontSize, fontWeight: 600, marginBottom: '1rem', textAlign: 'center', opacity: 0.6 }}>{content.title}</h2>}
    {content.subtitle && <p style={{ textAlign: 'center', opacity: 0.5, marginBottom: '2rem', fontSize: styles.fontSize * 0.875 }}>{content.subtitle}</p>}
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '3rem' }}>
      {content.logos.map((l: any) => <div key={l.id} style={{ padding: '1rem', opacity: content.grayscale ? 0.5 : 0.8, filter: content.grayscale ? 'grayscale(100%)' : 'none', transition: 'all 0.3s' }}>{l.url ? <img src={l.url} alt={l.name} style={{ height: '40px', objectFit: 'contain' }} /> : <div style={{ padding: '1rem 2rem', backgroundColor: styles.textColor === '#ffffff' ? 'rgba(255,255,255,0.1)' : '#f1f5f9', borderRadius: '0.5rem', fontWeight: 600, color: '#64748b' }}>{l.name}</div>}</div>)}
    </div>
  </div>
);

const DividerSection = ({ content, styles }: any) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem 0' }}>
    <div style={{ width: `${content.width}%`, height: content.height, backgroundColor: content.color, borderStyle: content.pattern === 'dashed' ? 'dashed' : content.pattern === 'dotted' ? 'dotted' : 'solid', borderWidth: content.pattern !== 'solid' ? `${content.height}px 0 0 0` : 0, borderColor: content.color }} />
  </div>
);

const SpacerSection = ({ content }: any) => <div style={{ height: content.height }} />;

const CustomSection = ({ content, isPreview, onUpdate }: any) => (
  <div>
    {isPreview ? <div dangerouslySetInnerHTML={{ __html: content.html }} /> : (
      <div>
        <div dangerouslySetInnerHTML={{ __html: content.html }} style={{ marginBottom: '1rem' }} />
        <textarea value={content.html} onChange={(e) => onUpdate({ ...content, html: e.target.value })} placeholder="HTML/CSSを入力" rows={6} className="w-full p-4 font-mono text-sm bg-gray-100 border rounded-lg" style={{ boxSizing: 'border-box' }} />
      </div>
    )}
  </div>
);

// ===== STYLE EDITOR =====
const StyleEditor = ({ section, pageSettings, onUpdate, onClose }: { section: Section; pageSettings: PageSettings; onUpdate: (u: Partial<Section>) => void; onClose: () => void }) => {
  const [tab, setTab] = useState<'layout' | 'style' | 'typography' | 'animation' | 'button' | 'advanced'>('layout');
  const [styles, setStyles] = useState(section.styles);
  const [buttonStyles, setButtonStyles] = useState(section.buttonStyles || getDefaultButtonStyles());

  const updateStyles = (u: Partial<SectionStyles>) => { const n = { ...styles, ...u }; setStyles(n); onUpdate({ styles: n }); };
  const updateButtonStyles = (u: Partial<ButtonStyles>) => { const n = { ...buttonStyles, ...u }; setButtonStyles(n); onUpdate({ buttonStyles: n }); };

  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 bg-slate-800 border-l border-slate-700 overflow-y-auto z-50">
      <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2"><Sliders size={18} /> スタイル設定</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        <div className="flex gap-1 flex-wrap">
          <TabButton active={tab === 'layout'} onClick={() => setTab('layout')}><Layout size={14} /></TabButton>
          <TabButton active={tab === 'style'} onClick={() => setTab('style')}><Palette size={14} /></TabButton>
          <TabButton active={tab === 'typography'} onClick={() => setTab('typography')}><Type size={14} /></TabButton>
          <TabButton active={tab === 'animation'} onClick={() => setTab('animation')}><Play size={14} /></TabButton>
          {['hero', 'cta', 'contact', 'pricing'].includes(section.type) && <TabButton active={tab === 'button'} onClick={() => setTab('button')}><MousePointer size={14} /></TabButton>}
          <TabButton active={tab === 'advanced'} onClick={() => setTab('advanced')}><Code size={14} /></TabButton>
        </div>
      </div>

      <div className="p-4">
        {tab === 'layout' && (
          <>
            <SliderInput label="上余白" value={styles.paddingTop} onChange={(v) => updateStyles({ paddingTop: v })} min={0} max={200} unit="px" />
            <SliderInput label="下余白" value={styles.paddingBottom} onChange={(v) => updateStyles({ paddingBottom: v })} min={0} max={200} unit="px" />
            <SliderInput label="左右余白" value={styles.paddingLeft} onChange={(v) => updateStyles({ paddingLeft: v, paddingRight: v })} min={0} max={100} unit="px" />
            <SelectInput label="最大幅" value={styles.maxWidth} onChange={(v) => updateStyles({ maxWidth: v })} options={[{ name: '狭い (800px)', value: '800px' }, { name: '標準 (1000px)', value: '1000px' }, { name: '広い (1200px)', value: '1200px' }, { name: '最大 (1400px)', value: '1400px' }, { name: '全幅', value: '100%' }]} />
            <SelectInput label="配置" value={styles.textAlign} onChange={(v) => updateStyles({ textAlign: v })} options={[{ name: '左揃え', value: 'left' }, { name: '中央', value: 'center' }, { name: '右揃え', value: 'right' }]} />
            {['features', 'pricing', 'gallery'].includes(section.type) && (
              <>
                <SliderInput label="カラム数" value={styles.columns} onChange={(v) => updateStyles({ columns: v })} min={1} max={6} />
                <SliderInput label="間隔" value={styles.gap} onChange={(v) => updateStyles({ gap: v })} min={8} max={64} unit="px" />
              </>
            )}
          </>
        )}

        {tab === 'style' && (
          <>
            <div className="mb-4">
              <label className="block text-gray-400 text-xs mb-2 uppercase tracking-wide">背景タイプ</label>
              <div className="grid grid-cols-3 gap-2">
                {['solid', 'gradient', 'image'].map((t) => (
                  <button key={t} onClick={() => updateStyles({ backgroundType: t })} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${styles.backgroundType === t ? 'bg-sky-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}>
                    {t === 'solid' ? '単色' : t === 'gradient' ? 'グラデ' : '画像'}
                  </button>
                ))}
              </div>
            </div>
            {styles.backgroundType === 'solid' && <ColorInput label="背景色" value={styles.backgroundColor} onChange={(v) => updateStyles({ backgroundColor: v })} />}
            {styles.backgroundType === 'gradient' && (
              <>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <ColorInput label="開始色" value={styles.gradientFrom} onChange={(v) => updateStyles({ gradientFrom: v })} />
                  <ColorInput label="終了色" value={styles.gradientTo} onChange={(v) => updateStyles({ gradientTo: v })} />
                </div>
                <SliderInput label="角度" value={styles.gradientDirection} onChange={(v) => updateStyles({ gradientDirection: v })} min={0} max={360} unit="°" />
              </>
            )}
            {styles.backgroundType === 'image' && (
              <>
                <ImageUploader value={styles.backgroundImage} onChange={(v) => updateStyles({ backgroundImage: v })} label="背景画像" />
                <SelectInput label="サイズ" value={styles.backgroundSize} onChange={(v) => updateStyles({ backgroundSize: v })} options={[{ name: 'カバー', value: 'cover' }, { name: '含む', value: 'contain' }, { name: '自動', value: 'auto' }]} />
                <SliderInput label="オーバーレイ" value={styles.backgroundOverlay} onChange={(v) => updateStyles({ backgroundOverlay: v })} min={0} max={1} step={0.1} />
              </>
            )}
            <ColorInput label="テキスト色" value={styles.textColor} onChange={(v) => updateStyles({ textColor: v })} />
            <SliderInput label="角丸" value={styles.borderRadius} onChange={(v) => updateStyles({ borderRadius: v })} min={0} max={48} unit="px" />
            <SliderInput label="ボーダー幅" value={styles.borderWidth} onChange={(v) => updateStyles({ borderWidth: v })} min={0} max={8} unit="px" />
            {styles.borderWidth > 0 && <ColorInput label="ボーダー色" value={styles.borderColor} onChange={(v) => updateStyles({ borderColor: v })} />}
            <div className="mb-4">
              <label className="block text-gray-400 text-xs mb-2 uppercase tracking-wide">シャドウ</label>
              <div className="grid grid-cols-2 gap-2">
                <SliderInput label="X" value={styles.shadowX} onChange={(v) => updateStyles({ shadowX: v })} min={-50} max={50} unit="px" />
                <SliderInput label="Y" value={styles.shadowY} onChange={(v) => updateStyles({ shadowY: v })} min={-50} max={50} unit="px" />
                <SliderInput label="ぼかし" value={styles.shadowBlur} onChange={(v) => updateStyles({ shadowBlur: v })} min={0} max={100} unit="px" />
                <SliderInput label="広がり" value={styles.shadowSpread} onChange={(v) => updateStyles({ shadowSpread: v })} min={-50} max={50} unit="px" />
              </div>
              <ColorInput label="シャドウ色" value={styles.shadowColor} onChange={(v) => updateStyles({ shadowColor: v })} />
            </div>
          </>
        )}

        {tab === 'typography' && (
          <>
            <SelectInput label="フォント" value={styles.fontFamily} onChange={(v) => updateStyles({ fontFamily: v })} options={FONTS.map(f => ({ name: f.name, value: f.value }))} />
            <SliderInput label="見出しサイズ" value={styles.headingSize} onChange={(v) => updateStyles({ headingSize: v })} min={24} max={96} unit="px" />
            <SliderInput label="本文サイズ" value={styles.fontSize} onChange={(v) => updateStyles({ fontSize: v })} min={12} max={24} unit="px" />
            <SliderInput label="行間" value={styles.lineHeight} onChange={(v) => updateStyles({ lineHeight: v })} min={1} max={2.5} step={0.1} />
            <SliderInput label="文字間隔" value={styles.letterSpacing} onChange={(v) => updateStyles({ letterSpacing: v })} min={-2} max={10} step={0.5} unit="px" />
          </>
        )}

        {tab === 'animation' && (
          <>
            <SelectInput label="アニメーション" value={styles.animation} onChange={(v) => updateStyles({ animation: v })} options={ANIMATIONS.map(a => ({ name: a.name, value: a.value }))} />
            <SliderInput label="時間" value={styles.animationDuration} onChange={(v) => updateStyles({ animationDuration: v })} min={0.1} max={2} step={0.1} unit="秒" />
            <SliderInput label="遅延" value={styles.animationDelay} onChange={(v) => updateStyles({ animationDelay: v })} min={0} max={2} step={0.1} unit="秒" />
          </>
        )}

        {tab === 'button' && (
          <>
            <ColorInput label="ボタン背景" value={buttonStyles.backgroundColor} onChange={(v) => updateButtonStyles({ backgroundColor: v })} />
            <ColorInput label="ボタン文字色" value={buttonStyles.textColor} onChange={(v) => updateButtonStyles({ textColor: v })} />
            <SelectInput label="形状" value={buttonStyles.borderRadius} onChange={(v) => updateButtonStyles({ borderRadius: Number(v) })} options={BUTTON_SHAPES.map(s => ({ name: s.name, value: s.value }))} />
            <SliderInput label="横パディング" value={buttonStyles.paddingX} onChange={(v) => updateButtonStyles({ paddingX: v })} min={8} max={64} unit="px" />
            <SliderInput label="縦パディング" value={buttonStyles.paddingY} onChange={(v) => updateButtonStyles({ paddingY: v })} min={4} max={32} unit="px" />
            <SliderInput label="文字サイズ" value={buttonStyles.fontSize} onChange={(v) => updateButtonStyles({ fontSize: v })} min={12} max={24} unit="px" />
            <SelectInput label="ホバー効果" value={buttonStyles.hoverEffect} onChange={(v) => updateButtonStyles({ hoverEffect: v })} options={HOVER_EFFECTS.map(e => ({ name: e.name, value: e.value }))} />
          </>
        )}

        {tab === 'advanced' && (
          <>
            <div className="mb-4">
              <label className="block text-gray-400 text-xs mb-2 uppercase tracking-wide">カスタムCSS</label>
              <textarea value={styles.customCSS} onChange={(e) => updateStyles({ customCSS: e.target.value })} placeholder=".section { /* CSS */ }" rows={6} className="w-full px-3 py-2 bg-slate-700 border-0 rounded text-white text-sm font-mono" style={{ boxSizing: 'border-box' }} />
            </div>
            <button onClick={() => updateStyles(getDefaultStyles(section.type))} className="w-full px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 flex items-center justify-center gap-2">
              <RotateCcw size={16} /> デフォルトに戻す
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ===== PAGE SETTINGS =====
const PageSettingsPanel = ({ settings, onUpdate, onClose }: { settings: PageSettings; onUpdate: (s: PageSettings) => void; onClose: () => void }) => {
  const [tab, setTab] = useState<'general' | 'seo' | 'theme' | 'code'>('general');
  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 bg-slate-800 border-l border-slate-700 overflow-y-auto z-50">
      <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2"><Settings size={18} /> ページ設定</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        <div className="flex gap-1">
          <TabButton active={tab === 'general'} onClick={() => setTab('general')}>基本</TabButton>
          <TabButton active={tab === 'seo'} onClick={() => setTab('seo')}>SEO</TabButton>
          <TabButton active={tab === 'theme'} onClick={() => setTab('theme')}>テーマ</TabButton>
          <TabButton active={tab === 'code'} onClick={() => setTab('code')}>コード</TabButton>
        </div>
      </div>
      <div className="p-4">
        {tab === 'general' && (
          <>
            <div className="mb-4"><label className="block text-gray-400 text-xs mb-2 uppercase tracking-wide">ページタイトル</label><input type="text" value={settings.title} onChange={(e) => onUpdate({ ...settings, title: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border-0 rounded text-white" /></div>
            <ImageUploader value={settings.favicon} onChange={(v) => onUpdate({ ...settings, favicon: v })} label="ファビコン" />
          </>
        )}
        {tab === 'seo' && (
          <>
            <div className="mb-4"><label className="block text-gray-400 text-xs mb-2 uppercase tracking-wide">メタ説明</label><textarea value={settings.description} onChange={(e) => onUpdate({ ...settings, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-slate-700 border-0 rounded text-white text-sm" style={{ boxSizing: 'border-box' }} /></div>
            <ImageUploader value={settings.ogImage} onChange={(v) => onUpdate({ ...settings, ogImage: v })} label="OGP画像" />
            <ColorInput label="テーマカラー" value={settings.themeColor} onChange={(v) => onUpdate({ ...settings, themeColor: v })} />
          </>
        )}
        {tab === 'theme' && (
          <>
            <SelectInput label="メインフォント" value={settings.fontPrimary} onChange={(v) => onUpdate({ ...settings, fontPrimary: v })} options={FONTS.map(f => ({ name: f.name, value: f.value }))} />
            <ColorInput label="プライマリカラー" value={settings.colorPrimary} onChange={(v) => onUpdate({ ...settings, colorPrimary: v })} />
            <ColorInput label="セカンダリカラー" value={settings.colorSecondary} onChange={(v) => onUpdate({ ...settings, colorSecondary: v })} />
            <ColorInput label="アクセントカラー" value={settings.colorAccent} onChange={(v) => onUpdate({ ...settings, colorAccent: v })} />
          </>
        )}
        {tab === 'code' && (
          <>
            <div className="mb-4"><label className="block text-gray-400 text-xs mb-2 uppercase tracking-wide">カスタムHead</label><textarea value={settings.customHead} onChange={(e) => onUpdate({ ...settings, customHead: e.target.value })} placeholder="<script>...</script>" rows={4} className="w-full px-3 py-2 bg-slate-700 border-0 rounded text-white text-xs font-mono" style={{ boxSizing: 'border-box' }} /></div>
            <div className="mb-4"><label className="block text-gray-400 text-xs mb-2 uppercase tracking-wide">グローバルCSS</label><textarea value={settings.customCSS} onChange={(e) => onUpdate({ ...settings, customCSS: e.target.value })} placeholder="body { }" rows={6} className="w-full px-3 py-2 bg-slate-700 border-0 rounded text-white text-xs font-mono" style={{ boxSizing: 'border-box' }} /></div>
          </>
        )}
      </div>
    </div>
  );
};

// ===== TEMPLATES =====
const templates: Record<string, { name: string; desc: string; Icon: any; sections: Omit<Section, 'id'>[] }> = {
  blank: { name: '空白', desc: 'ゼロから作成', Icon: Plus, sections: [] },
  saas: { name: 'SaaS', desc: 'ソフトウェアサービス', Icon: Sparkles, sections: [
    { type: 'hero', content: { ...getDefaultContent('hero'), title: '業務効率を\n10倍にする', subtitle: 'AIを活用した次世代プラットフォームで、チームの生産性を劇的に向上' }, styles: { ...getDefaultStyles('hero'), backgroundType: 'gradient', gradientFrom: '#0f172a', gradientTo: '#1e3a5f', gradientDirection: 135 }, buttonStyles: getDefaultButtonStyles() },
    { type: 'logos', content: getDefaultContent('logos'), styles: { ...getDefaultStyles('logos'), backgroundColor: '#f8fafc', paddingTop: 60, paddingBottom: 60 } },
    { type: 'features', content: getDefaultContent('features'), styles: getDefaultStyles('features') },
    { type: 'stats', content: getDefaultContent('stats'), styles: { ...getDefaultStyles('stats'), backgroundType: 'gradient', gradientFrom: '#0ea5e9', gradientTo: '#8b5cf6' } },
    { type: 'pricing', content: getDefaultContent('pricing'), styles: getDefaultStyles('pricing'), buttonStyles: getDefaultButtonStyles() },
    { type: 'testimonials', content: getDefaultContent('testimonials'), styles: { ...getDefaultStyles('testimonials'), backgroundColor: '#f8fafc' } },
    { type: 'faq', content: getDefaultContent('faq'), styles: getDefaultStyles('faq') },
    { type: 'cta', content: getDefaultContent('cta'), styles: { ...getDefaultStyles('cta'), backgroundType: 'gradient', gradientFrom: '#0ea5e9', gradientTo: '#8b5cf6' }, buttonStyles: getDefaultButtonStyles() },
    { type: 'footer', content: getDefaultContent('footer'), styles: getDefaultStyles('footer') }
  ]},
  coaching: { name: 'コーチング', desc: '個人サービス', Icon: Users, sections: [
    { type: 'hero', content: { ...getDefaultContent('hero'), title: 'あなたの可能性を\n最大限に引き出す', subtitle: '10年以上の経験を持つ専門コーチが、目標達成をサポートします', ctaText: '無料相談を予約' }, styles: { ...getDefaultStyles('hero'), backgroundType: 'gradient', gradientFrom: '#1e3a5f', gradientTo: '#0f172a' }, buttonStyles: getDefaultButtonStyles() },
    { type: 'stats', content: { ...getDefaultContent('stats'), stats: [{ id: '1', value: '500+', label: 'クライアント実績' }, { id: '2', value: '95%', label: '目標達成率' }, { id: '3', value: '10年+', label: '経験年数' }] }, styles: { ...getDefaultStyles('stats'), backgroundColor: '#ffffff', textColor: '#1f2937' } },
    { type: 'features', content: { ...getDefaultContent('features'), title: 'サービス内容', subtitle: '3つのプログラムであなたの成長をサポート' }, styles: getDefaultStyles('features') },
    { type: 'testimonials', content: getDefaultContent('testimonials'), styles: { ...getDefaultStyles('testimonials'), backgroundColor: '#f8fafc' } },
    { type: 'pricing', content: { ...getDefaultContent('pricing'), title: 'コース一覧' }, styles: getDefaultStyles('pricing'), buttonStyles: getDefaultButtonStyles() },
    { type: 'contact', content: { ...getDefaultContent('contact'), title: '無料相談を予約' }, styles: { ...getDefaultStyles('contact'), backgroundColor: '#0f172a', textColor: '#ffffff' }, buttonStyles: getDefaultButtonStyles() },
    { type: 'footer', content: getDefaultContent('footer'), styles: getDefaultStyles('footer') }
  ]},
};

const TemplateSelector = ({ onSelect, onClose }: { onSelect: (k: string) => void; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
    <div className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-xl font-bold">テンプレートを選択</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Object.entries(templates).map(([k, t]) => (
          <button key={k} onClick={() => { onSelect(k); onClose(); }} className="p-4 rounded-xl border-2 border-slate-600 hover:border-sky-500 transition-colors text-left group">
            <div className="w-12 h-12 rounded-xl bg-slate-700 group-hover:bg-sky-600/20 flex items-center justify-center mb-3 transition-colors"><t.Icon size={24} className="text-sky-500" /></div>
            <h3 className="text-white font-semibold mb-1">{t.name}</h3>
            <p className="text-gray-400 text-sm">{t.desc}</p>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ===== EXPORT =====
const exportToHTML = (sections: Section[], settings: PageSettings) => {
  const fontLinks = [...new Set([settings.fontPrimary, ...sections.map(s => s.styles.fontFamily)])].map(f => {
    const font = FONTS.find(fo => fo.value === f);
    return font ? `<link href="https://fonts.googleapis.com/css2?family=${font.name.replace(/ /g, '+').replace(/ /g, '+')}:wght@400;500;600;700&display=swap" rel="stylesheet">` : '';
  }).join('\n');

  const css = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: ${settings.fontPrimary}; line-height: 1.6; }
      img { max-width: 100%; height: auto; }
      a { text-decoration: none; transition: opacity 0.2s; }
      a:hover { opacity: 0.8; }
      button { cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
      button:hover { transform: translateY(-2px); }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      .animate { animation-fill-mode: both; }
      ${settings.customCSS}
    </style>
  `;

  const getPad = (s: SectionStyles) => `${s.paddingTop}px ${s.paddingRight}px ${s.paddingBottom}px ${s.paddingLeft}px`;
  const getBg = (s: SectionStyles) => s.backgroundType === 'gradient' ? `background: linear-gradient(${s.gradientDirection}deg, ${s.gradientFrom}, ${s.gradientTo});` : s.backgroundType === 'image' && s.backgroundImage ? `background-image: url(${s.backgroundImage}); background-size: ${s.backgroundSize}; background-position: ${s.backgroundPosition};` : `background-color: ${s.backgroundColor};`;
  const getShadow = (s: SectionStyles) => s.shadowBlur > 0 ? `box-shadow: ${s.shadowX}px ${s.shadowY}px ${s.shadowBlur}px ${s.shadowSpread}px ${s.shadowColor};` : '';
  const getAnim = (s: SectionStyles) => s.animation !== 'none' ? `animation: ${s.animation} ${s.animationDuration}s ease-out ${s.animationDelay}s;` : '';

  const renderSection = (sec: Section): string => {
    const { type, content: c, styles: s, buttonStyles: btn } = sec;
    const base = `${getBg(s)} color: ${s.textColor}; padding: ${getPad(s)}; font-family: ${s.fontFamily}; ${getShadow(s)} ${getAnim(s)}`;
    const btnBase = btn ? `background-color: ${btn.backgroundColor}; color: ${btn.textColor}; border-radius: ${btn.borderRadius}px; padding: ${btn.paddingY}px ${btn.paddingX}px; font-size: ${btn.fontSize}px; font-weight: ${btn.fontWeight}; border: none; display: inline-flex; align-items: center; gap: 0.5rem;` : '';

    if (type === 'hero') return `<section style="${base} position: relative; min-height: 600px; display: flex; align-items: center; justify-content: center;" class="animate">${c.showOverlay && s.backgroundType === 'image' ? `<div style="position: absolute; inset: 0; background-color: rgba(0,0,0,${s.backgroundOverlay});"></div>` : ''}<div style="position: relative; z-index: 10; max-width: ${s.maxWidth}; margin: 0 auto; text-align: ${s.textAlign}; padding: 2rem;"><h1 style="font-size: clamp(2rem, 5vw, ${s.headingSize}px); font-weight: bold; margin-bottom: 1.5rem; line-height: 1.1; white-space: pre-line;">${c.title}</h1><p style="font-size: clamp(1rem, 2vw, ${s.fontSize * 1.25}px); opacity: 0.9; margin-bottom: 2.5rem; max-width: 700px; ${s.textAlign === 'center' ? 'margin-left: auto; margin-right: auto;' : ''} line-height: ${s.lineHeight};">${c.subtitle}</p><div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: ${s.textAlign === 'center' ? 'center' : s.textAlign === 'right' ? 'flex-end' : 'flex-start'};"><a href="${c.ctaLink}" style="${btnBase}">${c.ctaText} →</a>${c.secondaryCtaText ? `<a href="${c.secondaryCtaLink}" style="${btnBase} background-color: transparent; color: inherit; border: 2px solid currentColor;">${c.secondaryCtaText}</a>` : ''}</div></div></section>`;
    if (type === 'features') return `<section style="${base}" class="animate"><div style="max-width: ${s.maxWidth}; margin: 0 auto;"><div style="text-align: ${s.textAlign}; margin-bottom: 3rem;"><h2 style="font-size: ${s.headingSize * 0.75}px; font-weight: bold; margin-bottom: 1rem;">${c.title}</h2><p style="opacity: 0.7; max-width: 600px; ${s.textAlign === 'center' ? 'margin: 0 auto;' : ''}">${c.subtitle}</p></div><div style="display: grid; grid-template-columns: repeat(${s.columns}, 1fr); gap: ${s.gap}px;">${c.features.map((f: any) => `<div style="text-align: center; padding: 2rem; border-radius: ${s.borderRadius}px; background: ${s.textColor === '#ffffff' ? 'rgba(255,255,255,0.05)' : 'rgba(14,165,233,0.05)'};"><div style="width: 4rem; height: 4rem; margin: 0 auto 1.5rem; background: linear-gradient(135deg, #0ea5e9, #8b5cf6); border-radius: 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">✦</div><h3 style="font-size: ${s.fontSize * 1.25}px; font-weight: 600; margin-bottom: 0.75rem;">${f.title}</h3><p style="opacity: 0.7; line-height: ${s.lineHeight};">${f.description}</p></div>`).join('')}</div></div></section>`;
    if (type === 'stats') return `<section style="${base}" class="animate"><div style="max-width: ${s.maxWidth}; margin: 0 auto;"><div style="display: grid; grid-template-columns: repeat(${c.stats.length}, 1fr); gap: ${s.gap}px;">${c.stats.map((st: any) => `<div style="text-align: center; padding: 1.5rem;"><div style="font-size: ${s.headingSize * 0.8}px; font-weight: bold; margin-bottom: 0.5rem; background: linear-gradient(135deg, #0ea5e9, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${st.value}</div><div style="opacity: 0.7;">${st.label}</div></div>`).join('')}</div></div></section>`;
    if (type === 'cta') return `<section style="${base}" class="animate"><div style="text-align: center; max-width: 800px; margin: 0 auto;"><h2 style="font-size: ${s.headingSize * 0.75}px; font-weight: bold; margin-bottom: 1rem;">${c.title}</h2><p style="font-size: ${s.fontSize * 1.25}px; opacity: 0.9; margin-bottom: 2.5rem;">${c.subtitle}</p><div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;"><a href="${c.buttonLink}" style="${btnBase} ${s.textColor === '#ffffff' ? 'background: white; color: #0ea5e9;' : ''}">${c.buttonText} →</a>${c.secondaryText ? `<a href="${c.secondaryLink}" style="${btnBase} background: transparent; color: inherit; border: 2px solid currentColor;">${c.secondaryText}</a>` : ''}</div></div></section>`;
    if (type === 'footer') return `<footer style="${base}"><div style="max-width: ${s.maxWidth}; margin: 0 auto;"><div style="display: grid; grid-template-columns: 2fr repeat(${c.links.length}, 1fr); gap: 3rem; margin-bottom: 3rem;"><div><div style="width: 3rem; height: 3rem; background: linear-gradient(135deg, #0ea5e9, #8b5cf6); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin-bottom: 1rem;">${c.companyName?.charAt(0) || 'L'}</div><p style="opacity: 0.7; line-height: ${s.lineHeight};">${c.description}</p></div>${c.links.map((g: any) => `<div><h4 style="font-weight: 600; margin-bottom: 1.5rem;">${g.title}</h4><ul style="list-style: none; padding: 0; margin: 0;">${g.items.map((i: any) => `<li style="margin-bottom: 0.75rem;"><a href="${i.url}" style="opacity: 0.7; color: inherit;">${i.label}</a></li>`).join('')}</ul></div>`).join('')}</div><div style="border-top: 1px solid ${s.textColor === '#ffffff' ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}; padding-top: 2rem; text-align: center;"><p style="opacity: 0.7; font-size: ${s.fontSize * 0.875}px;">${c.copyright}</p></div></div></footer>`;
    if (type === 'testimonials') return `<section style="${base}" class="animate"><div style="max-width: ${s.maxWidth}; margin: 0 auto;"><div style="text-align: ${s.textAlign}; margin-bottom: 3rem;"><h2 style="font-size: ${s.headingSize * 0.75}px; font-weight: bold; margin-bottom: 1rem;">${c.title}</h2></div><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: ${s.gap}px;">${c.testimonials.map((t: any) => `<div style="background: ${s.textColor === '#ffffff' ? 'rgba(255,255,255,0.05)' : '#f8fafc'}; padding: 2rem; border-radius: ${s.borderRadius}px;"><div style="margin-bottom: 1rem;">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div><p style="font-size: ${s.fontSize * 1.125}px; line-height: ${s.lineHeight}; margin-bottom: 1.5rem;">${t.content}</p><div style="display: flex; align-items: center; gap: 1rem;"><div style="width: 3rem; height: 3rem; border-radius: 50%; background: linear-gradient(135deg, #0ea5e9, #8b5cf6); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${t.name.charAt(0)}</div><div><div style="font-weight: 600;">${t.name}</div><div style="font-size: ${s.fontSize * 0.875}px; opacity: 0.7;">${t.role}${t.company ? ` / ${t.company}` : ''}</div></div></div></div>`).join('')}</div></div></section>`;
    if (type === 'pricing') return `<section style="${base}" class="animate"><div style="max-width: ${s.maxWidth}; margin: 0 auto;"><div style="text-align: center; margin-bottom: 3rem;"><h2 style="font-size: ${s.headingSize * 0.75}px; font-weight: bold; margin-bottom: 1rem;">${c.title}</h2><p style="opacity: 0.7;">${c.subtitle}</p></div><div style="display: grid; grid-template-columns: repeat(${s.columns}, 1fr); gap: ${s.gap}px; align-items: start;">${c.plans.map((p: any) => `<div style="padding: 2.5rem; border-radius: ${s.borderRadius}px; position: relative; ${p.isPopular ? 'background: linear-gradient(135deg, #0ea5e9, #8b5cf6); color: white; transform: scale(1.05); box-shadow: 0 25px 50px -12px rgba(14,165,233,0.4);' : `background: ${s.textColor === '#ffffff' ? 'rgba(255,255,255,0.05)' : 'white'}; border: 1px solid #e5e7eb;`}">${p.isPopular ? '<div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); padding: 0.25rem 1rem; background: #fbbf24; color: #1f2937; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">人気</div>' : ''}<h3 style="font-size: ${s.fontSize * 1.5}px; font-weight: bold; margin-bottom: 0.5rem;">${p.name}</h3><p style="font-size: ${s.fontSize * 0.875}px; opacity: 0.8; margin-bottom: 1.5rem;">${p.description}</p><div style="margin-bottom: 2rem;"><span style="font-size: ${s.headingSize * 0.6}px; font-weight: bold;">${p.price}</span><span style="opacity: 0.7;">${p.period}</span></div><ul style="list-style: none; padding: 0; margin-bottom: 2rem;">${p.features.map((f: string) => `<li style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">✓ ${f}</li>`).join('')}</ul><button style="${btnBase} width: 100%; justify-content: center; ${p.isPopular ? 'background: white; color: #0ea5e9;' : ''}">${p.ctaText}</button></div>`).join('')}</div></div></section>`;
    if (type === 'faq') return `<section style="${base}" class="animate"><div style="max-width: 800px; margin: 0 auto;"><div style="text-align: ${s.textAlign}; margin-bottom: 3rem;"><h2 style="font-size: ${s.headingSize * 0.75}px; font-weight: bold; margin-bottom: 1rem;">${c.title}</h2><p style="opacity: 0.7;">${c.subtitle}</p></div><div style="display: flex; flex-direction: column; gap: 1rem;">${c.items.map((item: any, i: number) => `<details ${i === 0 ? 'open' : ''} style="border: 1px solid ${s.textColor === '#ffffff' ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}; border-radius: ${s.borderRadius}px; overflow: hidden;"><summary style="padding: 1.5rem; cursor: pointer; font-weight: 600; font-size: ${s.fontSize * 1.125}px; list-style: none;">${item.question}</summary><div style="padding: 0 1.5rem 1.5rem; opacity: 0.8; line-height: ${s.lineHeight};">${item.answer}</div></details>`).join('')}</div></div></section>`;
    if (type === 'logos') return `<section style="${base}" class="animate"><div style="max-width: ${s.maxWidth}; margin: 0 auto;">${c.title ? `<h2 style="font-size: ${s.fontSize}px; font-weight: 600; margin-bottom: 1rem; text-align: center; opacity: 0.6;">${c.title}</h2>` : ''}${c.subtitle ? `<p style="text-align: center; opacity: 0.5; margin-bottom: 2rem; font-size: ${s.fontSize * 0.875}px;">${c.subtitle}</p>` : ''}<div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 3rem;">${c.logos.map((l: any) => `<div style="padding: 1rem; opacity: ${c.grayscale ? '0.5' : '0.8'}; ${c.grayscale ? 'filter: grayscale(100%);' : ''}">${l.url ? `<img src="${l.url}" alt="${l.name}" style="height: 40px; object-fit: contain;">` : `<div style="padding: 1rem 2rem; background: ${s.textColor === '#ffffff' ? 'rgba(255,255,255,0.1)' : '#f1f5f9'}; border-radius: 0.5rem; font-weight: 600; color: #64748b;">${l.name}</div>`}</div>`).join('')}</div></div></section>`;
    if (type === 'video') return `<section style="${base}" class="animate"><div style="max-width: 900px; margin: 0 auto;"><div style="text-align: center; margin-bottom: 2rem;"><h2 style="font-size: ${s.headingSize * 0.75}px; font-weight: bold; margin-bottom: 1rem;">${c.title}</h2><p style="opacity: 0.7;">${c.subtitle}</p></div><div style="position: relative; padding-bottom: ${c.aspectRatio === '16/9' ? '56.25%' : '75%'}; border-radius: ${s.borderRadius}px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);"><iframe src="${c.videoUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div></section>`;
    if (type === 'gallery') return `<section style="${base}" class="animate"><div style="max-width: ${s.maxWidth}; margin: 0 auto;">${c.title ? `<div style="text-align: center; margin-bottom: 2rem;"><h2 style="font-size: ${s.headingSize * 0.75}px; font-weight: bold;">${c.title}</h2></div>` : ''}<div style="display: grid; grid-template-columns: repeat(${c.columns}, 1fr); gap: ${c.gap}px;">${c.images.map((img: any) => `<div style="aspect-ratio: ${c.aspectRatio}; border-radius: ${s.borderRadius}px; overflow: hidden; background: #f1f5f9;">${img.url ? `<img src="${img.url}" alt="${img.caption}" style="width: 100%; height: 100%; object-fit: cover;">` : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #94a3b8;">${img.caption}</div>`}</div>`).join('')}</div></div></section>`;
    if (type === 'contact') return `<section style="${base}" class="animate"><div style="max-width: 600px; margin: 0 auto;"><div style="text-align: center; margin-bottom: 3rem;"><h2 style="font-size: ${s.headingSize * 0.75}px; font-weight: bold; margin-bottom: 1rem;">${c.title}</h2><p style="opacity: 0.7;">${c.subtitle}</p></div><form style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">${c.fields.map((f: any) => `<div style="grid-column: ${f.width === 'full' ? '1 / -1' : 'auto'};"><label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">${f.label}${f.required ? '<span style="color: #ef4444;"> *</span>' : ''}</label>${f.type === 'textarea' ? `<textarea placeholder="${f.placeholder}" rows="4" style="width: 100%; padding: 0.875rem; border: ${s.textColor === '#ffffff' ? '1px solid rgba(255,255,255,0.2)' : '2px solid #e5e7eb'}; border-radius: ${s.borderRadius}px; background: ${s.textColor === '#ffffff' ? 'rgba(255,255,255,0.1)' : 'white'}; color: ${s.textColor === '#ffffff' ? 'white' : '#1f2937'}; resize: none; box-sizing: border-box; font-family: inherit;"></textarea>` : f.type === 'select' ? `<select style="width: 100%; padding: 0.875rem; border: ${s.textColor === '#ffffff' ? '1px solid rgba(255,255,255,0.2)' : '2px solid #e5e7eb'}; border-radius: ${s.borderRadius}px; background: ${s.textColor === '#ffffff' ? 'rgba(255,255,255,0.1)' : 'white'}; color: ${s.textColor === '#ffffff' ? 'white' : '#1f2937'}; box-sizing: border-box; font-family: inherit;"><option value="">${f.placeholder}</option>${f.options?.map((o: string) => `<option value="${o}">${o}</option>`).join('')}</select>` : `<input type="${f.type}" placeholder="${f.placeholder}" style="width: 100%; padding: 0.875rem; border: ${s.textColor === '#ffffff' ? '1px solid rgba(255,255,255,0.2)' : '2px solid #e5e7eb'}; border-radius: ${s.borderRadius}px; background: ${s.textColor === '#ffffff' ? 'rgba(255,255,255,0.1)' : 'white'}; color: ${s.textColor === '#ffffff' ? 'white' : '#1f2937'}; box-sizing: border-box; font-family: inherit;">`}</div>`).join('')}<div style="grid-column: 1 / -1; text-align: center;"><button type="submit" style="${btnBase}">${c.submitText} →</button></div></form></div></section>`;
    if (type === 'divider') return `<div style="padding: 1rem 0;"><div style="width: ${c.width}%; height: ${c.height}px; margin: 0 auto; background: ${c.color}; ${c.pattern !== 'solid' ? `border-style: ${c.pattern}; border-width: ${c.height}px 0 0 0; border-color: ${c.color}; background: transparent;` : ''}"></div></div>`;
    if (type === 'spacer') return `<div style="height: ${c.height}px;"></div>`;
    if (type === 'custom') return c.html;
    return '';
  };

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${settings.title}</title>
  <meta name="description" content="${settings.description}">
  <meta name="theme-color" content="${settings.themeColor}">
  <meta property="og:title" content="${settings.title}">
  <meta property="og:description" content="${settings.description}">
  ${settings.ogImage ? `<meta property="og:image" content="${settings.ogImage}">` : ''}
  ${settings.favicon ? `<link rel="icon" href="${settings.favicon}">` : ''}
  ${fontLinks}
  ${css}
  ${settings.customHead}
</head>
<body>
  ${sections.map(renderSection).join('\n')}
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${settings.title.toLowerCase().replace(/\s+/g, '-')}.html`;
  a.click();
  URL.revokeObjectURL(url);
};

// ===== MAIN APP =====
export default function App() {
  const [sections, setSections] = useState<Section[]>([{ id: '1', type: 'hero', content: getDefaultContent('hero'), styles: getDefaultStyles('hero'), buttonStyles: getDefaultButtonStyles() }]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showStyleEditor, setShowStyleEditor] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [pageSettings, setPageSettings] = useState<PageSettings>(defaultPageSettings);
  const [history, setHistory] = useState<Section[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveToHistory = useCallback((newSections: Section[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newSections)));
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => { if (historyIndex > 0) { setHistoryIndex(historyIndex - 1); setSections(JSON.parse(JSON.stringify(history[historyIndex - 1]))); } }, [history, historyIndex]);
  const redo = useCallback(() => { if (historyIndex < history.length - 1) { setHistoryIndex(historyIndex + 1); setSections(JSON.parse(JSON.stringify(history[historyIndex + 1]))); } }, [history, historyIndex]);

  const addSection = (type: SectionType) => {
    const newSections = [...sections, { id: Date.now().toString(), type, content: getDefaultContent(type), styles: getDefaultStyles(type), buttonStyles: getDefaultButtonStyles() }];
    setSections(newSections);
    saveToHistory(newSections);
  };

  const deleteSection = (id: string) => {
    const newSections = sections.filter(s => s.id !== id);
    setSections(newSections);
    saveToHistory(newSections);
    if (selectedId === id) { setSelectedId(null); setShowStyleEditor(false); }
  };

  const duplicateSection = (id: string) => {
    const idx = sections.findIndex(s => s.id === id);
    if (idx !== -1) {
      const copy = { ...JSON.parse(JSON.stringify(sections[idx])), id: Date.now().toString() };
      const newSections = [...sections];
      newSections.splice(idx + 1, 0, copy);
      setSections(newSections);
      saveToHistory(newSections);
    }
  };

  const moveSection = (id: string, dir: 'up' | 'down') => {
    const idx = sections.findIndex(s => s.id === id);
    if ((dir === 'up' && idx > 0) || (dir === 'down' && idx < sections.length - 1)) {
      const newSections = [...sections];
      const t = dir === 'up' ? idx - 1 : idx + 1;
      [newSections[idx], newSections[t]] = [newSections[t], newSections[idx]];
      setSections(newSections);
      saveToHistory(newSections);
    }
  };

  const updateSection = (id: string, u: Partial<Section>) => {
    const newSections = sections.map(s => s.id === id ? { ...s, ...u } : s);
    setSections(newSections);
  };

  const loadTemplate = (k: string) => {
    const t = templates[k];
    if (t) {
      const newSections = t.sections.map(s => ({ ...s, id: Date.now().toString() + Math.random() }));
      setSections(newSections);
      saveToHistory(newSections);
    }
  };

  const selectedSection = sections.find(s => s.id === selectedId);
  const deviceWidths = { desktop: '100%', tablet: '768px', mobile: '375px' };

  const getSectionStyle = (s: SectionStyles): React.CSSProperties => ({
    ...(s.backgroundType === 'gradient' ? { background: `linear-gradient(${s.gradientDirection}deg, ${s.gradientFrom}, ${s.gradientTo})` } : s.backgroundType === 'image' && s.backgroundImage ? { backgroundImage: `url(${s.backgroundImage})`, backgroundSize: s.backgroundSize, backgroundPosition: s.backgroundPosition } : { backgroundColor: s.backgroundColor }),
    color: s.textColor,
    padding: `${s.paddingTop}px ${s.paddingRight}px ${s.paddingBottom}px ${s.paddingLeft}px`,
    fontFamily: s.fontFamily,
    borderRadius: s.borderRadius,
    ...(s.borderWidth > 0 ? { border: `${s.borderWidth}px solid ${s.borderColor}` } : {}),
    ...(s.shadowBlur > 0 ? { boxShadow: `${s.shadowX}px ${s.shadowY}px ${s.shadowBlur}px ${s.shadowSpread}px ${s.shadowColor}` } : {}),
  });

  const renderSection = (sec: Section) => {
    const props = { content: sec.content, styles: sec.styles, buttonStyles: sec.buttonStyles, isPreview: mode === 'preview', onUpdate: (c: any) => updateSection(sec.id, { content: c }) };
    const comps: Record<SectionType, any> = { hero: HeroSection, features: FeaturesSection, pricing: PricingSection, testimonials: TestimonialsSection, stats: StatsSection, video: VideoSection, gallery: GallerySection, logos: LogosSection, faq: FAQSection, cta: CTASection, contact: ContactSection, footer: FooterSection, divider: DividerSection, spacer: SpacerSection, custom: CustomSection };
    const C = comps[sec.type];
    return C ? <C {...props} /> : null;
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {showTemplates && <TemplateSelector onSelect={loadTemplate} onClose={() => setShowTemplates(false)} />}

      <header className="h-14 flex items-center justify-between px-4 bg-slate-800 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">LP</div>
            <span className="text-white font-semibold hidden sm:inline">Builder Pro</span>
          </div>
          <div className="flex gap-1">
            <button onClick={undo} disabled={historyIndex <= 0} className="p-2 text-gray-400 hover:text-white disabled:opacity-30" title="元に戻す"><Undo size={18} /></button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 text-gray-400 hover:text-white disabled:opacity-30" title="やり直し"><Redo size={18} /></button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowTemplates(true)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 text-sm"><FolderOpen size={16} /><span className="hidden sm:inline">テンプレート</span></button>
          <button onClick={() => setShowPageSettings(true)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 text-sm"><Settings size={16} /><span className="hidden sm:inline">設定</span></button>

          <div className="flex bg-slate-900 rounded-lg p-1 ml-2">
            {([{ t: 'desktop', I: Monitor }, { t: 'tablet', I: Tablet }, { t: 'mobile', I: Smartphone }] as const).map(({ t, I }) => (
              <button key={t} onClick={() => setDevice(t)} className={`p-2 rounded-md transition-colors ${device === t ? 'bg-sky-600 text-white' : 'text-gray-400 hover:bg-slate-700'}`}><I size={18} /></button>
            ))}
          </div>

          <div className="flex bg-slate-900 rounded-lg p-1">
            <button onClick={() => setMode('edit')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${mode === 'edit' ? 'bg-sky-600 text-white' : 'text-gray-400 hover:bg-slate-700'}`}><Pencil size={16} /><span className="hidden sm:inline">編集</span></button>
            <button onClick={() => setMode('preview')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${mode === 'preview' ? 'bg-sky-600 text-white' : 'text-gray-400 hover:bg-slate-700'}`}><Eye size={16} /><span className="hidden sm:inline">プレビュー</span></button>
          </div>
        </div>

        <button onClick={() => exportToHTML(sections, pageSettings)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-violet-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
          <Download size={18} /><span className="hidden sm:inline">エクスポート</span>
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {mode === 'edit' && (
          <aside className="w-64 bg-slate-800 border-r border-slate-700 overflow-y-auto shrink-0">
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-medium">セクション追加</p>
              <div className="grid grid-cols-3 gap-1">
                {(Object.keys(sectionMeta) as SectionType[]).map((type) => {
                  const { label, Icon } = sectionMeta[type];
                  return (
                    <button key={type} onClick={() => addSection(type)} className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-400 hover:bg-slate-700 hover:text-white transition-colors text-xs">
                      <Icon size={18} />{label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-700 p-4">
              <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-medium">レイヤー ({sections.length})</p>
              <div className="space-y-1">
                {sections.map((sec, idx) => {
                  const { Icon, label } = sectionMeta[sec.type];
                  return (
                    <div key={sec.id} onClick={() => { setSelectedId(sec.id); setShowStyleEditor(true); }} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${selectedId === sec.id ? 'bg-sky-600/20 ring-1 ring-sky-500' : 'hover:bg-slate-700'}`}>
                      <Icon size={14} className="text-gray-400 shrink-0" />
                      <span className="flex-1 text-sm text-gray-300 truncate">{label}</span>
                      <div className="flex gap-0.5 shrink-0">
                        <button onClick={(e) => { e.stopPropagation(); moveSection(sec.id, 'up'); }} className="p-1 hover:bg-slate-600 rounded disabled:opacity-30" disabled={idx === 0}><ChevronUp size={12} className="text-gray-400" /></button>
                        <button onClick={(e) => { e.stopPropagation(); moveSection(sec.id, 'down'); }} className="p-1 hover:bg-slate-600 rounded disabled:opacity-30" disabled={idx === sections.length - 1}><ChevronDown size={12} className="text-gray-400" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

        <main className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-950" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
          <div className="mx-auto bg-white min-h-full shadow-2xl transition-all duration-300 overflow-hidden" style={{ maxWidth: deviceWidths[device] }}>
            {sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <Wand2 size={48} className="mb-4 text-sky-500" />
                <p className="text-lg font-medium mb-2">ページを作成しましょう</p>
                <p className="text-sm mb-6 text-center">テンプレートから始めるか、<br />セクションを追加してください</p>
                <button onClick={() => setShowTemplates(true)} className="px-6 py-3 bg-gradient-to-r from-sky-600 to-violet-600 text-white rounded-xl font-semibold hover:opacity-90">テンプレートを選択</button>
              </div>
            ) : (
              sections.map(sec => (
                <div key={sec.id} className="relative group" onClick={() => mode === 'edit' && setSelectedId(sec.id)}>
                  {mode === 'edit' && (
                    <div className="absolute left-3 top-3 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedId(sec.id); setShowStyleEditor(true); }} className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors" title="スタイル"><Palette size={16} className="text-gray-600" /></button>
                      <button onClick={(e) => { e.stopPropagation(); duplicateSection(sec.id); }} className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors" title="複製"><Copy size={16} className="text-gray-600" /></button>
                      <button onClick={(e) => { e.stopPropagation(); deleteSection(sec.id); }} className="p-2 bg-white rounded-lg shadow-lg hover:bg-red-50 transition-colors" title="削除"><Trash2 size={16} className="text-red-500" /></button>
                    </div>
                  )}
                  <div className={`transition-shadow ${selectedId === sec.id && mode === 'edit' ? 'ring-2 ring-sky-500 ring-inset' : ''}`} style={getSectionStyle(sec.styles)}>
                    {renderSection(sec)}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {showStyleEditor && selectedSection && mode === 'edit' && (
          <StyleEditor section={selectedSection} pageSettings={pageSettings} onUpdate={(u) => { updateSection(selectedId!, u); saveToHistory(sections.map(s => s.id === selectedId ? { ...s, ...u } : s)); }} onClose={() => setShowStyleEditor(false)} />
        )}

        {showPageSettings && <PageSettingsPanel settings={pageSettings} onUpdate={setPageSettings} onClose={() => setShowPageSettings(false)} />}
      </div>
    </div>
  );
}
