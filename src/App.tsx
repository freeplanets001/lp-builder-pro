import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, LayoutGrid, CreditCard, HelpCircle, MousePointerClick, Mail, PanelBottom, Trash2, Copy, Eye, Pencil, Monitor, Tablet, Smartphone, Download, ChevronDown, Check, Image, Video, Quote, Users, BarChart3, Clock, Palette, Plus, X, Layers, Zap, Shield, Heart, Star, Target, TrendingUp, Award, ChevronRight, Minus, Move, Upload, FolderOpen, ChevronUp, Settings, Type, AlignLeft, AlignCenter, AlignRight, AlignJustify, Grid, RotateCcw, RotateCw, Save, FileUp, Table, GitBranch, Timer, UserCircle, MapPin, Code, Columns, Square, Circle, Grip, MoreVertical, ChevronLeft, Undo2, Redo2, Droplet, Sun, Moon, Maximize2, Box, Triangle } from 'lucide-react';

// ============================================
// TYPES
// ============================================
type SectionType = 'hero' | 'features' | 'pricing' | 'testimonials' | 'stats' | 'video' | 'gallery' | 'logos' | 'faq' | 'cta' | 'contact' | 'footer' | 'divider' | 'spacer' | 'comparison' | 'timeline' | 'countdown' | 'team' | 'map' | 'custom-html' | 'text-block' | 'image-text';

interface SpacingValue { top: number; right: number; bottom: number; left: number; }
interface BorderValue { width: number; style: string; color: string; radius: number; }
interface ShadowValue { x: number; y: number; blur: number; spread: number; color: string; }
interface FontValue { family: string; size: number; weight: number; lineHeight: number; letterSpacing: number; }

interface SectionStyles {
  backgroundColor: string;
  textColor: string;
  padding: SpacingValue;
  margin: SpacingValue;
  backgroundType: 'solid' | 'gradient' | 'image';
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;
  backgroundImage: string;
  backgroundOverlay: string;
  backgroundOverlayOpacity: number;
  border: BorderValue;
  shadow: ShadowValue;
  font: FontValue;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  animation: string;
  animationDuration: number;
  animationDelay: number;
  layout: 'full' | 'contained' | 'narrow';
  columns: number;
  gap: number;
  verticalAlign: 'top' | 'center' | 'bottom';
  minHeight: number;
  hideOnMobile: boolean;
  hideOnTablet: boolean;
  hideOnDesktop: boolean;
}

interface Section {
  id: string;
  type: SectionType;
  content: any;
  styles: SectionStyles;
}

interface GlobalStyles {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: number;
  spacing: number;
}

interface HistoryState {
  sections: Section[];
  globalStyles: GlobalStyles;
}

// ============================================
// CONSTANTS
// ============================================
const GOOGLE_FONTS = [
  'Inter', 'Poppins', 'Montserrat', 'Playfair Display', 'Roboto', 'Open Sans', 'Lato', 'Oswald',
  'Raleway', 'Merriweather', 'Nunito', 'Ubuntu', 'Rubik', 'Work Sans', 'Quicksand', 'Karla',
  'Source Sans Pro', 'DM Sans', 'Josefin Sans', 'Bebas Neue', 'Archivo', 'Space Grotesk',
  'Outfit', 'Sora', 'Manrope', 'Plus Jakarta Sans', 'Noto Sans JP', 'Zen Kaku Gothic New',
  'Kosugi Maru', 'M PLUS 1p', 'Sawarabi Gothic', 'Noto Serif JP', 'Shippori Mincho'
];

const ANIMATIONS = [
  { value: 'none', label: 'なし' },
  { value: 'fadeIn', label: 'フェードイン' },
  { value: 'fadeInUp', label: 'フェードイン（上から）' },
  { value: 'fadeInDown', label: 'フェードイン（下から）' },
  { value: 'fadeInLeft', label: 'フェードイン（左から）' },
  { value: 'fadeInRight', label: 'フェードイン（右から）' },
  { value: 'zoomIn', label: 'ズームイン' },
  { value: 'zoomOut', label: 'ズームアウト' },
  { value: 'bounceIn', label: 'バウンス' },
  { value: 'slideUp', label: 'スライドアップ' },
  { value: 'slideDown', label: 'スライドダウン' },
  { value: 'rotateIn', label: '回転イン' },
  { value: 'flipIn', label: 'フリップ' },
  { value: 'pulse', label: 'パルス' },
  { value: 'shake', label: 'シェイク' },
];

const COLOR_PALETTES = [
  { name: 'モダンブルー', colors: ['#0ea5e9', '#0284c7', '#0369a1', '#1e3a5f', '#0f172a'] },
  { name: 'サンセット', colors: ['#f97316', '#ea580c', '#c2410c', '#7c2d12', '#431407'] },
  { name: 'フォレスト', colors: ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'] },
  { name: 'ラベンダー', colors: ['#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87'] },
  { name: 'ローズ', colors: ['#f43f5e', '#e11d48', '#be123c', '#9f1239', '#881337'] },
  { name: 'オーシャン', colors: ['#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63'] },
  { name: 'ミッドナイト', colors: ['#1e1b4b', '#312e81', '#3730a3', '#4338ca', '#4f46e5'] },
  { name: 'ゴールド', colors: ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e'] },
];

const iconLibrary: Record<string, any> = { Zap, Shield, Heart, Star, Target, TrendingUp, Award, Users, BarChart3, Clock, Sparkles, Check, Mail, CreditCard, Code, Box, Triangle, Circle, Square, Sun, Moon, Droplet, MapPin, Grid };

// ============================================
// DEFAULT VALUES
// ============================================
const defaultSpacing: SpacingValue = { top: 80, right: 20, bottom: 80, left: 20 };
const defaultBorder: BorderValue = { width: 0, style: 'solid', color: '#e5e7eb', radius: 0 };
const defaultShadow: ShadowValue = { x: 0, y: 0, blur: 0, spread: 0, color: 'rgba(0,0,0,0.1)' };
const defaultFont: FontValue = { family: 'Noto Sans JP', size: 16, weight: 400, lineHeight: 1.6, letterSpacing: 0 };

const defaultGlobalStyles: GlobalStyles = {
  primaryColor: '#0ea5e9',
  secondaryColor: '#8b5cf6',
  accentColor: '#f59e0b',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  headingFont: 'Noto Sans JP',
  bodyFont: 'Noto Sans JP',
  borderRadius: 8,
  spacing: 16,
};

const getDefaultStyles = (type: SectionType): SectionStyles => ({
  backgroundColor: ['hero', 'cta', 'footer', 'stats'].includes(type) ? '#0f172a' : '#ffffff',
  textColor: ['hero', 'cta', 'footer', 'stats'].includes(type) ? '#ffffff' : '#1f2937',
  padding: type === 'hero' ? { top: 120, right: 20, bottom: 120, left: 20 } : type === 'spacer' ? { top: 0, right: 0, bottom: 0, left: 0 } : defaultSpacing,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  backgroundType: 'solid',
  gradientFrom: '#0ea5e9',
  gradientTo: '#8b5cf6',
  gradientAngle: 135,
  backgroundImage: '',
  backgroundOverlay: '#000000',
  backgroundOverlayOpacity: 0.5,
  border: defaultBorder,
  shadow: defaultShadow,
  font: defaultFont,
  textAlign: 'center',
  animation: 'none',
  animationDuration: 0.6,
  animationDelay: 0,
  layout: 'contained',
  columns: type === 'features' ? 3 : type === 'team' ? 4 : 1,
  gap: 32,
  verticalAlign: 'center',
  minHeight: type === 'hero' ? 600 : 0,
  hideOnMobile: false,
  hideOnTablet: false,
  hideOnDesktop: false,
});

const getDefaultContent = (type: SectionType): any => {
  const defaults: Record<SectionType, any> = {
    hero: { title: 'ビジネスを\n次のレベルへ', subtitle: 'シンプルで使いやすいサービスで成長をサポート', ctaText: '今すぐ始める', ctaLink: '#contact', secondaryCtaText: '詳しく見る', secondaryCtaLink: '#features', backgroundImage: '', titleFont: { family: 'Noto Sans JP', size: 56, weight: 700 }, subtitleFont: { family: 'Noto Sans JP', size: 20, weight: 400 } },
    features: { title: '主な特徴', subtitle: '選ばれる理由', features: [{ id: '1', icon: 'Zap', title: '高速', description: '驚くほど高速な処理' }, { id: '2', icon: 'Shield', title: '安全', description: '最高レベルのセキュリティ' }, { id: '3', icon: 'Heart', title: '使いやすい', description: '直感的なインターフェース' }] },
    pricing: { title: '料金プラン', subtitle: '最適なプランを選択', plans: [{ id: '1', name: 'スターター', price: '無料', period: '', description: '個人向け', features: ['基本機能', 'メールサポート'], ctaText: '無料で始める', isPopular: false }, { id: '2', name: 'プロ', price: '¥2,980', period: '/月', description: 'チーム向け', features: ['全機能', '優先サポート', 'API'], ctaText: '14日間無料', isPopular: true }, { id: '3', name: 'エンタープライズ', price: 'お問い合わせ', period: '', description: '大規模向け', features: ['カスタム機能', '専任サポート', 'SLA'], ctaText: 'お問い合わせ', isPopular: false }] },
    testimonials: { title: 'お客様の声', testimonials: [{ id: '1', name: '田中太郎', role: 'CEO', company: '株式会社サンプル', content: '業務効率が大幅に向上しました。導入して本当に良かったです。', avatar: '', rating: 5 }, { id: '2', name: '鈴木花子', role: 'マーケター', company: 'テック株式会社', content: '使いやすさと機能のバランスが素晴らしいです。', avatar: '', rating: 5 }] },
    stats: { title: '', stats: [{ id: '1', value: '10,000+', label: 'ユーザー', icon: 'Users' }, { id: '2', value: '99.9%', label: '稼働率', icon: 'TrendingUp' }, { id: '3', value: '50+', label: '導入企業', icon: 'Award' }, { id: '4', value: '24/7', label: 'サポート', icon: 'Clock' }] },
    video: { title: 'サービス紹介', subtitle: '', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', aspectRatio: '16:9' },
    gallery: { title: 'ギャラリー', images: [{ id: '1', url: '', caption: '画像1' }, { id: '2', url: '', caption: '画像2' }, { id: '3', url: '', caption: '画像3' }, { id: '4', url: '', caption: '画像4' }, { id: '5', url: '', caption: '画像5' }, { id: '6', url: '', caption: '画像6' }], columns: 3, gap: 16, aspectRatio: '4:3' },
    logos: { title: '導入企業', logos: [{ id: '1', name: 'Company A', url: '' }, { id: '2', name: 'Company B', url: '' }, { id: '3', name: 'Company C', url: '' }, { id: '4', name: 'Company D', url: '' }, { id: '5', name: 'Company E', url: '' }] },
    faq: { title: 'よくある質問', items: [{ id: '1', question: '無料プランでも全機能使えますか？', answer: '基本機能はすべてお使いいただけます。高度な機能は有料プランでご利用いただけます。' }, { id: '2', question: 'いつでも解約できますか？', answer: 'はい、いつでも解約可能です。日割り計算での返金も対応しております。' }, { id: '3', question: 'サポート体制はどうなっていますか？', answer: '有料プランでは24時間365日のサポートを提供しています。' }] },
    cta: { title: '今すぐ始めましょう', subtitle: '無料で始められます。クレジットカード不要。', buttonText: '無料で始める', buttonLink: '#', secondaryText: 'お問い合わせ', secondaryLink: '#contact' },
    contact: { title: 'お問い合わせ', subtitle: 'お気軽にご連絡ください', fields: [{ id: '1', type: 'text', label: 'お名前', placeholder: '山田太郎', required: true }, { id: '2', type: 'email', label: 'メールアドレス', placeholder: 'example@email.com', required: true }, { id: '3', type: 'select', label: 'お問い合わせ種別', placeholder: '選択してください', options: ['サービスについて', '料金について', 'その他'], required: true }, { id: '4', type: 'textarea', label: 'メッセージ', placeholder: 'お問い合わせ内容をご記入ください', required: true }], submitText: '送信する', successMessage: 'お問い合わせありがとうございます' },
    footer: { companyName: 'Your Company', description: 'ビジネスの成長をサポートするサービスを提供しています。', logo: '', links: [{ id: '1', title: 'サービス', items: [{ label: '機能', url: '#features' }, { label: '料金', url: '#pricing' }, { label: 'FAQ', url: '#faq' }] }, { id: '2', title: '会社情報', items: [{ label: '会社概要', url: '#' }, { label: 'お問い合わせ', url: '#contact' }] }], social: [{ platform: 'twitter', url: '#' }, { platform: 'facebook', url: '#' }, { platform: 'instagram', url: '#' }], copyright: '© 2026 Your Company. All rights reserved.' },
    divider: { style: 'solid', color: '#e5e7eb', width: 1, pattern: 'line' },
    spacer: { height: 80 },
    comparison: { title: '機能比較', headers: ['機能', 'スターター', 'プロ', 'エンタープライズ'], rows: [{ feature: '基本機能', values: ['○', '○', '○'] }, { feature: 'API連携', values: ['×', '○', '○'] }, { feature: '優先サポート', values: ['×', '○', '○'] }, { feature: 'カスタム開発', values: ['×', '×', '○'] }] },
    timeline: { title: 'ご利用の流れ', items: [{ id: '1', title: 'お申し込み', description: 'フォームから簡単にお申し込み', icon: 'Check' }, { id: '2', title: 'ヒアリング', description: '専任担当者がご要望をお伺い', icon: 'Users' }, { id: '3', title: '導入・設定', description: '最短3日で利用開始', icon: 'Zap' }, { id: '4', title: 'サポート', description: '導入後も手厚くサポート', icon: 'Heart' }] },
    countdown: { title: 'キャンペーン終了まで', targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), expiredMessage: 'キャンペーンは終了しました', labels: { days: '日', hours: '時間', minutes: '分', seconds: '秒' } },
    team: { title: 'チーム紹介', subtitle: '私たちがサポートします', members: [{ id: '1', name: '山田太郎', role: 'CEO', bio: '創業者。10年以上の業界経験。', image: '', social: { twitter: '#', linkedin: '#' } }, { id: '2', name: '鈴木花子', role: 'CTO', bio: '技術責任者。AI/ML専門家。', image: '', social: { twitter: '#', linkedin: '#' } }, { id: '3', name: '佐藤次郎', role: 'デザイナー', bio: 'UI/UXデザイン担当。', image: '', social: { twitter: '#', linkedin: '#' } }, { id: '4', name: '田中三郎', role: 'エンジニア', bio: 'フルスタック開発者。', image: '', social: { twitter: '#', linkedin: '#' } }] },
    map: { title: 'アクセス', address: '東京都渋谷区xxx-xxx', embedUrl: '', zoom: 15, showMarker: true },
    'custom-html': { title: 'カスタムHTML', html: '<div style="padding: 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 16px;"><h3 style="font-size: 24px; margin-bottom: 16px;">カスタムコンテンツ</h3><p>HTMLを自由に記述できます</p></div>' },
    'text-block': { title: '', content: '<h2>テキストブロック</h2><p>自由にテキストを記述できます。<strong>太字</strong>や<em>斜体</em>も使えます。</p><ul><li>リスト項目1</li><li>リスト項目2</li></ul>' },
    'image-text': { title: '', image: '', imagePosition: 'left', imageWidth: 50, heading: '見出しテキスト', content: '説明文をここに記述します。画像と組み合わせて、わかりやすいセクションを作成できます。', ctaText: '詳しく見る', ctaLink: '#' },
  };
  return defaults[type];
};

const sectionMeta: Record<SectionType, { label: string; Icon: any; category: string }> = {
  hero: { label: 'ヒーロー', Icon: Sparkles, category: 'メイン' },
  features: { label: '特徴', Icon: LayoutGrid, category: 'コンテンツ' },
  pricing: { label: '料金', Icon: CreditCard, category: 'コンテンツ' },
  testimonials: { label: 'お客様の声', Icon: Quote, category: 'コンテンツ' },
  stats: { label: '実績', Icon: BarChart3, category: 'コンテンツ' },
  video: { label: '動画', Icon: Video, category: 'メディア' },
  gallery: { label: 'ギャラリー', Icon: Image, category: 'メディア' },
  logos: { label: 'ロゴ', Icon: Layers, category: 'コンテンツ' },
  faq: { label: 'FAQ', Icon: HelpCircle, category: 'コンテンツ' },
  cta: { label: 'CTA', Icon: MousePointerClick, category: 'アクション' },
  contact: { label: 'お問い合わせ', Icon: Mail, category: 'アクション' },
  footer: { label: 'フッター', Icon: PanelBottom, category: 'ナビ' },
  divider: { label: '区切り線', Icon: Minus, category: 'レイアウト' },
  spacer: { label: 'スペース', Icon: Move, category: 'レイアウト' },
  comparison: { label: '比較表', Icon: Table, category: 'コンテンツ' },
  timeline: { label: 'タイムライン', Icon: GitBranch, category: 'コンテンツ' },
  countdown: { label: 'カウントダウン', Icon: Timer, category: 'アクション' },
  team: { label: 'チーム', Icon: UserCircle, category: 'コンテンツ' },
  map: { label: 'マップ', Icon: MapPin, category: 'メディア' },
  'custom-html': { label: 'HTML', Icon: Code, category: 'カスタム' },
  'text-block': { label: 'テキスト', Icon: Type, category: 'コンテンツ' },
  'image-text': { label: '画像+テキスト', Icon: Columns, category: 'コンテンツ' },
};

// ============================================
// TEMPLATES
// ============================================
const templates: Record<string, { name: string; desc: string; Icon: any; sections: Omit<Section, 'id'>[]; globalStyles?: Partial<GlobalStyles> }> = {
  blank: { name: '空白', desc: 'ゼロから作成', Icon: Plus, sections: [] },
  saas: { name: 'SaaS', desc: 'ソフトウェア向け', Icon: Zap, sections: [
    { type: 'hero', content: { ...getDefaultContent('hero'), title: '業務効率を\n10倍にする', subtitle: 'AIを活用した次世代プラットフォーム' }, styles: { ...getDefaultStyles('hero'), backgroundType: 'gradient', gradientFrom: '#0f172a', gradientTo: '#1e3a5f' } },
    { type: 'logos', content: getDefaultContent('logos'), styles: { ...getDefaultStyles('logos'), padding: { ...defaultSpacing, top: 40, bottom: 40 }, backgroundColor: '#f8fafc' } },
    { type: 'features', content: getDefaultContent('features'), styles: getDefaultStyles('features') },
    { type: 'stats', content: getDefaultContent('stats'), styles: { ...getDefaultStyles('stats'), backgroundType: 'gradient', gradientFrom: '#0ea5e9', gradientTo: '#8b5cf6' } },
    { type: 'pricing', content: getDefaultContent('pricing'), styles: getDefaultStyles('pricing') },
    { type: 'testimonials', content: getDefaultContent('testimonials'), styles: { ...getDefaultStyles('testimonials'), backgroundColor: '#f8fafc' } },
    { type: 'faq', content: getDefaultContent('faq'), styles: getDefaultStyles('faq') },
    { type: 'cta', content: getDefaultContent('cta'), styles: { ...getDefaultStyles('cta'), backgroundType: 'gradient' } },
    { type: 'footer', content: getDefaultContent('footer'), styles: getDefaultStyles('footer') }
  ], globalStyles: { primaryColor: '#0ea5e9', secondaryColor: '#8b5cf6' } },
  coaching: { name: 'コーチング', desc: '個人サービス', Icon: Users, sections: [
    { type: 'hero', content: { ...getDefaultContent('hero'), title: 'あなたの可能性を\n最大限に引き出す', subtitle: '10年の経験を持つ専門コーチがサポート', ctaText: '無料相談を予約' }, styles: { ...getDefaultStyles('hero'), backgroundType: 'gradient', gradientFrom: '#1e3a5f', gradientTo: '#0f172a' } },
    { type: 'stats', content: { ...getDefaultContent('stats'), stats: [{ id: '1', value: '500+', label: 'クライアント', icon: 'Users' }, { id: '2', value: '95%', label: '目標達成率', icon: 'Target' }, { id: '3', value: '10年', label: '経験', icon: 'Award' }, { id: '4', value: '4.9', label: '満足度', icon: 'Star' }] }, styles: { ...getDefaultStyles('stats'), backgroundColor: '#ffffff', textColor: '#1f2937' } },
    { type: 'timeline', content: { ...getDefaultContent('timeline'), title: 'コーチングの流れ' }, styles: getDefaultStyles('timeline') },
    { type: 'testimonials', content: getDefaultContent('testimonials'), styles: { ...getDefaultStyles('testimonials'), backgroundColor: '#f8fafc' } },
    { type: 'pricing', content: { ...getDefaultContent('pricing'), title: 'コース一覧' }, styles: getDefaultStyles('pricing') },
    { type: 'cta', content: { ...getDefaultContent('cta'), title: 'まずは無料相談から', buttonText: '無料相談を予約' }, styles: getDefaultStyles('cta') },
    { type: 'footer', content: getDefaultContent('footer'), styles: getDefaultStyles('footer') }
  ] },
  ecommerce: { name: '商品販売', desc: 'EC・物販向け', Icon: CreditCard, sections: [
    { type: 'hero', content: { ...getDefaultContent('hero'), title: '革新的な\nプロダクト', subtitle: 'あなたの生活を変えるデザイン', ctaText: '今すぐ購入' }, styles: { ...getDefaultStyles('hero'), backgroundColor: '#ffffff', textColor: '#1f2937' } },
    { type: 'gallery', content: { ...getDefaultContent('gallery'), title: '製品ギャラリー' }, styles: getDefaultStyles('gallery') },
    { type: 'features', content: { ...getDefaultContent('features'), title: '製品の特徴' }, styles: { ...getDefaultStyles('features'), backgroundColor: '#f8fafc' } },
    { type: 'comparison', content: { ...getDefaultContent('comparison'), title: 'モデル比較' }, styles: getDefaultStyles('comparison') },
    { type: 'testimonials', content: { ...getDefaultContent('testimonials'), title: 'レビュー' }, styles: { ...getDefaultStyles('testimonials'), backgroundColor: '#f8fafc' } },
    { type: 'faq', content: getDefaultContent('faq'), styles: getDefaultStyles('faq') },
    { type: 'cta', content: { ...getDefaultContent('cta'), title: '期間限定 20% OFF', subtitle: 'クーポンコード: WELCOME20' }, styles: { ...getDefaultStyles('cta'), backgroundType: 'gradient', gradientFrom: '#f59e0b', gradientTo: '#ef4444' } },
    { type: 'footer', content: getDefaultContent('footer'), styles: getDefaultStyles('footer') }
  ], globalStyles: { primaryColor: '#f59e0b', accentColor: '#ef4444' } },
  portfolio: { name: 'ポートフォリオ', desc: 'クリエイター向け', Icon: Star, sections: [
    { type: 'hero', content: { ...getDefaultContent('hero'), title: 'Creative\nPortfolio', subtitle: 'デザイン × テクノロジー × クリエイティビティ', ctaText: 'Works', secondaryCtaText: 'Contact' }, styles: { ...getDefaultStyles('hero'), backgroundType: 'solid', backgroundColor: '#000000', textColor: '#ffffff' } },
    { type: 'stats', content: { ...getDefaultContent('stats'), stats: [{ id: '1', value: '100+', label: 'プロジェクト', icon: 'Award' }, { id: '2', value: '50+', label: 'クライアント', icon: 'Users' }, { id: '3', value: '8年', label: '経験', icon: 'Clock' }, { id: '4', value: '5', label: '受賞歴', icon: 'Star' }] }, styles: { ...getDefaultStyles('stats'), backgroundColor: '#111111', textColor: '#ffffff' } },
    { type: 'gallery', content: { ...getDefaultContent('gallery'), title: 'Works', columns: 3 }, styles: { ...getDefaultStyles('gallery'), backgroundColor: '#000000', textColor: '#ffffff' } },
    { type: 'features', content: { ...getDefaultContent('features'), title: 'Services', features: [{ id: '1', icon: 'Star', title: 'ブランディング', description: 'ロゴ・VI・ブランド戦略' }, { id: '2', icon: 'Code', title: 'Web制作', description: 'Webサイト・アプリ開発' }, { id: '3', icon: 'Target', title: '写真・映像', description: '撮影・編集・モーション' }] }, styles: { ...getDefaultStyles('features'), backgroundColor: '#111111', textColor: '#ffffff' } },
    { type: 'contact', content: getDefaultContent('contact'), styles: { ...getDefaultStyles('contact'), backgroundColor: '#000000', textColor: '#ffffff' } },
    { type: 'footer', content: getDefaultContent('footer'), styles: { ...getDefaultStyles('footer'), backgroundColor: '#000000' } }
  ], globalStyles: { primaryColor: '#ffffff', backgroundColor: '#000000', textColor: '#ffffff' } },
  event: { name: 'イベント', desc: 'セミナー・イベント', Icon: Timer, sections: [
    { type: 'hero', content: { ...getDefaultContent('hero'), title: 'AI Summit\n2026', subtitle: '未来を創るAIカンファレンス', ctaText: '今すぐ申込む' }, styles: { ...getDefaultStyles('hero'), backgroundType: 'gradient', gradientFrom: '#667eea', gradientTo: '#764ba2' } },
    { type: 'countdown', content: { ...getDefaultContent('countdown'), title: '開催まで' }, styles: { ...getDefaultStyles('countdown'), backgroundColor: '#f8fafc' } },
    { type: 'timeline', content: { ...getDefaultContent('timeline'), title: 'タイムテーブル', items: [{ id: '1', title: '10:00 開場', description: '受付開始', icon: 'Clock' }, { id: '2', title: '10:30 基調講演', description: 'AIの未来', icon: 'Sparkles' }, { id: '3', title: '12:00 ランチ', description: 'ネットワーキング', icon: 'Users' }, { id: '4', title: '14:00 パネル', description: 'ディスカッション', icon: 'Target' }] }, styles: getDefaultStyles('timeline') },
    { type: 'team', content: { ...getDefaultContent('team'), title: '登壇者' }, styles: { ...getDefaultStyles('team'), backgroundColor: '#f8fafc' } },
    { type: 'pricing', content: { ...getDefaultContent('pricing'), title: 'チケット', plans: [{ id: '1', name: '一般', price: '¥5,000', period: '', description: '1日参加', features: ['全セッション', 'ランチ付き'], ctaText: '購入', isPopular: false }, { id: '2', name: 'VIP', price: '¥15,000', period: '', description: 'プレミアム', features: ['全セッション', 'ランチ付き', '懇親会', '特別席'], ctaText: '購入', isPopular: true }] }, styles: getDefaultStyles('pricing') },
    { type: 'map', content: { ...getDefaultContent('map'), title: '会場' }, styles: getDefaultStyles('map') },
    { type: 'cta', content: { ...getDefaultContent('cta'), title: '参加登録', subtitle: '席数限定・お早めに' }, styles: { ...getDefaultStyles('cta'), backgroundType: 'gradient', gradientFrom: '#667eea', gradientTo: '#764ba2' } },
    { type: 'footer', content: getDefaultContent('footer'), styles: getDefaultStyles('footer') }
  ], globalStyles: { primaryColor: '#667eea', secondaryColor: '#764ba2' } }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

const DynamicIcon = ({ name, size = 24, style = {} }: { name: string; size?: number; style?: React.CSSProperties }) => {
  const IconComponent = iconLibrary[name] || Sparkles;
  return <IconComponent size={size} style={style} />;
};

// ============================================
// IMAGE UPLOADER COMPONENT
// ============================================
const ImageUploader = ({ value, onChange, label = "画像" }: { value: string; onChange: (v: string) => void; label?: string }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const handleFile = (file: File) => {
    if (file?.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => onChange(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="mb-4">
      <label className="block text-gray-400 text-xs mb-2 uppercase tracking-wider">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${isDragging ? 'border-sky-500 bg-sky-500/10' : 'border-gray-600 hover:border-gray-500'}`}
      >
        {value ? (
          <div className="relative inline-block">
            <img src={value} alt="Preview" className="max-w-full max-h-24 rounded object-cover" />
            <button onClick={(e) => { e.stopPropagation(); onChange(''); }} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">×</button>
          </div>
        ) : (
          <div className="text-gray-500"><Upload size={20} className="mx-auto mb-1" /><p className="text-xs">ドラッグ&ドロップ</p></div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
      <input
        type="text"
        value={typeof value === 'string' && !value.startsWith('data:') ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="または画像URLを入力"
        className="w-full mt-2 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-xs"
      />
    </div>
  );
};

// ============================================
// SECTION COMPONENTS
// ============================================
const HeroSection = ({ content, styles, isPreview, onUpdate, globalStyles }: any) => {
  const bgStyle: React.CSSProperties = styles.backgroundType === 'gradient'
    ? { background: `linear-gradient(${styles.gradientAngle}deg, ${styles.gradientFrom}, ${styles.gradientTo})` }
    : styles.backgroundType === 'image' && (content.backgroundImage || styles.backgroundImage)
    ? { backgroundImage: `url(${content.backgroundImage || styles.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};
  return (
    <div style={{ position: 'relative', minHeight: styles.minHeight || 600, display: 'flex', alignItems: 'center', justifyContent: 'center', ...bgStyle }}>
      {(styles.backgroundType === 'image' || content.backgroundImage) && styles.backgroundOverlayOpacity > 0 && (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: styles.backgroundOverlay, opacity: styles.backgroundOverlayOpacity }} />
      )}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: styles.layout === 'narrow' ? '48rem' : styles.layout === 'contained' ? '72rem' : '100%', width: '100%', margin: '0 auto', textAlign: styles.textAlign as any, padding: '2rem' }}>
        <h1
          style={{ fontSize: `clamp(2rem, 6vw, ${content.titleFont?.size || 56}px)`, fontWeight: content.titleFont?.weight || 700, fontFamily: content.titleFont?.family || globalStyles?.headingFont, marginBottom: '1.5rem', lineHeight: 1.1, whiteSpace: 'pre-line' }}
          contentEditable={!isPreview}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate({ ...content, title: e.currentTarget.textContent })}
        >{content.title}</h1>
        <p
          style={{ fontSize: `clamp(1rem, 2vw, ${content.subtitleFont?.size || 20}px)`, fontWeight: content.subtitleFont?.weight || 400, fontFamily: content.subtitleFont?.family || globalStyles?.bodyFont, opacity: 0.9, marginBottom: '2.5rem', maxWidth: '600px', marginLeft: styles.textAlign === 'center' ? 'auto' : 0, marginRight: styles.textAlign === 'center' ? 'auto' : 0 }}
          contentEditable={!isPreview}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate({ ...content, subtitle: e.currentTarget.textContent })}
        >{content.subtitle}</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: styles.textAlign === 'center' ? 'center' : styles.textAlign === 'right' ? 'flex-end' : 'flex-start' }}>
          <a href={content.ctaLink} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', backgroundColor: globalStyles?.primaryColor || '#0ea5e9', color: 'white', borderRadius: `${globalStyles?.borderRadius || 8}px`, fontSize: '1.125rem', fontWeight: 600, textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s' }} className="hover:scale-105 hover:shadow-lg">{content.ctaText} <ChevronRight size={20} /></a>
          {content.secondaryCtaText && (
            <a href={content.secondaryCtaLink} style={{ display: 'inline-flex', alignItems: 'center', padding: '1rem 2rem', backgroundColor: 'rgba(255,255,255,0.1)', color: 'inherit', border: '2px solid currentColor', borderRadius: `${globalStyles?.borderRadius || 8}px`, fontWeight: 600, textDecoration: 'none', transition: 'transform 0.2s' }} className="hover:scale-105">{content.secondaryCtaText}</a>
          )}
        </div>
      </div>
    </div>
  );
};

const FeaturesSection = ({ content, styles, isPreview, onUpdate, globalStyles }: any) => {
  const updateFeature = (id: string, updates: any) => onUpdate({ ...content, features: content.features.map((f: any) => f.id === id ? { ...f, ...updates } : f) });
  const addFeature = () => onUpdate({ ...content, features: [...content.features, { id: generateId(), icon: 'Star', title: '新機能', description: '説明文' }] });
  const removeFeature = (id: string) => onUpdate({ ...content, features: content.features.filter((f: any) => f.id !== id) });
  return (
    <div style={{ maxWidth: styles.layout === 'narrow' ? '48rem' : '72rem', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: globalStyles?.headingFont }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => onUpdate({ ...content, title: e.currentTarget.textContent })}>{content.title}</h2>
        <p style={{ opacity: 0.7, maxWidth: '600px', margin: '0 auto', fontFamily: globalStyles?.bodyFont }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => onUpdate({ ...content, subtitle: e.currentTarget.textContent })}>{content.subtitle}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${styles.columns || 3}, 1fr)`, gap: `${styles.gap || 32}px` }}>
        {content.features.map((f: any) => (
          <div key={f.id} style={{ position: 'relative', textAlign: styles.textAlign as any, padding: '2rem', borderRadius: `${globalStyles?.borderRadius || 8}px`, backgroundColor: styles.backgroundColor === '#ffffff' ? 'rgba(14,165,233,0.05)' : 'rgba(255,255,255,0.05)', border: `1px solid ${styles.backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'}` }}>
            {!isPreview && <button onClick={() => removeFeature(f.id)} className="absolute top-2 right-2 opacity-50 hover:opacity-100"><X size={14} /></button>}
            <div style={{ width: '4rem', height: '4rem', margin: styles.textAlign === 'center' ? '0 auto 1.5rem' : '0 0 1.5rem', background: `linear-gradient(135deg, ${globalStyles?.primaryColor || '#0ea5e9'}, ${globalStyles?.secondaryColor || '#8b5cf6'})`, borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <DynamicIcon name={f.icon} size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', fontFamily: globalStyles?.headingFont }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => updateFeature(f.id, { title: e.currentTarget.textContent })}>{f.title}</h3>
            <p style={{ opacity: 0.7, lineHeight: 1.7, fontFamily: globalStyles?.bodyFont }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => updateFeature(f.id, { description: e.currentTarget.textContent })}>{f.description}</p>
          </div>
        ))}
      </div>
      {!isPreview && <div className="text-center mt-6"><button onClick={addFeature} className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"><Plus size={18} /> 追加</button></div>}
    </div>
  );
};

const StatsSection = ({ content, styles, isPreview, onUpdate, globalStyles }: any) => {
  const updateStat = (id: string, updates: any) => onUpdate({ ...content, stats: content.stats.map((s: any) => s.id === id ? { ...s, ...updates } : s) });
  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
      {content.title && <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '3rem', textAlign: 'center', fontFamily: globalStyles?.headingFont }}>{content.title}</h2>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${styles.columns || 4}, 1fr)`, gap: `${styles.gap || 32}px` }}>
        {content.stats.map((s: any) => (
          <div key={s.id} style={{ textAlign: 'center', padding: '1.5rem' }}>
            {s.icon && <div style={{ marginBottom: '1rem' }}><DynamicIcon name={s.icon} size={32} style={{ opacity: 0.7, margin: '0 auto' }} /></div>}
            <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem', background: `linear-gradient(135deg, ${globalStyles?.primaryColor || '#0ea5e9'}, ${globalStyles?.secondaryColor || '#8b5cf6'})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => updateStat(s.id, { value: e.currentTarget.textContent })}>{s.value}</div>
            <div style={{ opacity: 0.7, fontFamily: globalStyles?.bodyFont }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => updateStat(s.id, { label: e.currentTarget.textContent })}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TestimonialsSection = ({ content, styles, isPreview, onUpdate, globalStyles }: any) => {
  const updateTestimonial = (id: string, updates: any) => onUpdate({ ...content, testimonials: content.testimonials.map((t: any) => t.id === id ? { ...t, ...updates } : t) });
  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: globalStyles?.headingFont }}>{content.title}</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${styles.columns || 2}, 1fr)`, gap: `${styles.gap || 32}px` }}>
        {content.testimonials.map((t: any) => (
          <div key={t.id} style={{ backgroundColor: styles.backgroundColor === '#ffffff' ? '#f8fafc' : 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: `${globalStyles?.borderRadius || 8}px` }}>
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < t.rating ? '#fbbf24' : 'none'} color={i < t.rating ? '#fbbf24' : '#d1d5db'} />)}
            </div>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.8, marginBottom: '1.5rem', fontFamily: globalStyles?.bodyFont }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => updateTestimonial(t.id, { content: e.currentTarget.textContent })}>{t.content}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: globalStyles?.primaryColor || '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', overflow: 'hidden' }}>
                {t.avatar ? <img src={t.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : t.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontFamily: globalStyles?.headingFont }}>{t.name}</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>{t.role}{t.company && ` / ${t.company}`}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PricingSection = ({ content, styles, isPreview, onUpdate, globalStyles }: any) => (
  <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: globalStyles?.headingFont }}>{content.title}</h2>
      <p style={{ opacity: 0.7, fontFamily: globalStyles?.bodyFont }}>{content.subtitle}</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${content.plans.length}, 1fr)`, gap: '2rem', alignItems: 'start' }}>
      {content.plans.map((p: any) => (
        <div key={p.id} style={{ padding: '2.5rem', borderRadius: `${(globalStyles?.borderRadius || 8) * 2}px`, position: 'relative', background: p.isPopular ? `linear-gradient(135deg, ${globalStyles?.primaryColor || '#0ea5e9'}, ${globalStyles?.secondaryColor || '#8b5cf6'})` : '#ffffff', color: p.isPopular ? 'white' : 'inherit', boxShadow: p.isPopular ? '0 25px 50px -12px rgba(14, 165, 233, 0.4)' : '0 4px 6px -1px rgba(0,0,0,0.1)', transform: p.isPopular ? 'scale(1.05)' : 'none', border: p.isPopular ? 'none' : '1px solid #e5e7eb' }}>
          {p.isPopular && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', padding: '0.25rem 1rem', backgroundColor: globalStyles?.accentColor || '#fbbf24', color: '#1f2937', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>人気</div>}
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', fontFamily: globalStyles?.headingFont }}>{p.name}</h3>
          <p style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '1.5rem' }}>{p.description}</p>
          <div style={{ marginBottom: '2rem' }}><span style={{ fontSize: '3rem', fontWeight: 'bold' }}>{p.price}</span><span style={{ opacity: 0.7 }}>{p.period}</span></div>
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
            {p.features.map((f: string, i: number) => <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}><Check size={16} style={{ color: p.isPopular ? 'white' : globalStyles?.primaryColor || '#0ea5e9', flexShrink: 0 }} /> {f}</li>)}
          </ul>
          <button style={{ width: '100%', padding: '1rem', borderRadius: `${globalStyles?.borderRadius || 8}px`, fontWeight: 600, cursor: 'pointer', border: 'none', backgroundColor: p.isPopular ? 'white' : globalStyles?.primaryColor || '#0ea5e9', color: p.isPopular ? globalStyles?.primaryColor || '#0ea5e9' : 'white', transition: 'transform 0.2s' }} className="hover:scale-105">{p.ctaText}</button>
        </div>
      ))}
    </div>
  </div>
);

const FAQSection = ({ content, styles, isPreview, onUpdate, globalStyles }: any) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const updateItem = (id: string, updates: any) => onUpdate({ ...content, items: content.items.map((item: any) => item.id === id ? { ...item, ...updates } : item) });
  const addItem = () => onUpdate({ ...content, items: [...content.items, { id: generateId(), question: '新しい質問', answer: '回答を入力してください。' }] });
  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: globalStyles?.headingFont }}>{content.title}</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {content.items.map((item: any, idx: number) => (
          <div key={item.id} style={{ border: '1px solid #e5e7eb', borderRadius: `${globalStyles?.borderRadius || 8}px`, overflow: 'hidden', backgroundColor: 'white' }}>
            <button onClick={() => setOpenIdx(openIdx === idx ? null : idx)} style={{ width: '100%', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: openIdx === idx ? '#f8fafc' : 'white', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontWeight: 600, fontSize: '1.125rem', color: '#1f2937', fontFamily: globalStyles?.headingFont }} contentEditable={!isPreview} suppressContentEditableWarning onClick={(e) => e.stopPropagation()} onBlur={(e) => updateItem(item.id, { question: e.currentTarget.textContent })}>{item.question}</span>
              <ChevronDown size={20} style={{ flexShrink: 0, transform: openIdx === idx ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', color: '#6b7280' }} />
            </button>
            <div style={{ maxHeight: openIdx === idx ? '500px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease-in-out' }}>
              <div style={{ padding: '0 1.5rem 1.5rem', color: '#4b5563', lineHeight: 1.8, fontFamily: globalStyles?.bodyFont }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => updateItem(item.id, { answer: e.currentTarget.textContent })}>{item.answer}</div>
            </div>
          </div>
        ))}
      </div>
      {!isPreview && <div className="text-center mt-6"><button onClick={addItem} className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400"><Plus size={18} /> 追加</button></div>}
    </div>
  );
};

const CTASection = ({ content, styles, isPreview, onUpdate, globalStyles }: any) => (
  <div style={{ textAlign: 'center', maxWidth: '48rem', margin: '0 auto' }}>
    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: globalStyles?.headingFont }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => onUpdate({ ...content, title: e.currentTarget.textContent })}>{content.title}</h2>
    <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '2.5rem', fontFamily: globalStyles?.bodyFont }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => onUpdate({ ...content, subtitle: e.currentTarget.textContent })}>{content.subtitle}</p>
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
      <a href={content.buttonLink} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', backgroundColor: 'white', color: globalStyles?.primaryColor || '#0ea5e9', borderRadius: `${globalStyles?.borderRadius || 8}px`, fontSize: '1.125rem', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }} className="hover:scale-105">{content.buttonText} <ChevronRight size={20} /></a>
      {content.secondaryText && <a href={content.secondaryLink} style={{ display: 'inline-flex', alignItems: 'center', padding: '1rem 2.5rem', backgroundColor: 'transparent', color: 'white', border: '2px solid white', borderRadius: `${globalStyles?.borderRadius || 8}px`, fontWeight: 600, textDecoration: 'none', transition: 'transform 0.2s' }} className="hover:scale-105">{content.secondaryText}</a>}
    </div>
  </div>
);

const ContactSection = ({ content, styles, isPreview, onUpdate, globalStyles }: any) => (
  <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: globalStyles?.headingFont }}>{content.title}</h2>
      <p style={{ opacity: 0.7, fontFamily: globalStyles?.bodyFont }}>{content.subtitle}</p>
    </div>
    <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {content.fields.map((field: any) => (
        <div key={field.id}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', fontFamily: globalStyles?.bodyFont }}>{field.label}{field.required && <span style={{ color: '#ef4444' }}> *</span>}</label>
          {field.type === 'textarea' ? (
            <textarea placeholder={field.placeholder} rows={4} style={{ width: '100%', padding: '0.875rem', border: '2px solid #e5e7eb', borderRadius: `${globalStyles?.borderRadius || 8}px`, resize: 'none', boxSizing: 'border-box', backgroundColor: styles.textColor === '#ffffff' ? 'rgba(255,255,255,0.1)' : 'white', color: styles.textColor, fontFamily: globalStyles?.bodyFont }} />
          ) : field.type === 'select' ? (
            <select style={{ width: '100%', padding: '0.875rem', border: '2px solid #e5e7eb', borderRadius: `${globalStyles?.borderRadius || 8}px`, boxSizing: 'border-box', backgroundColor: styles.textColor === '#ffffff' ? 'rgba(255,255,255,0.1)' : 'white', color: styles.textColor, fontFamily: globalStyles?.bodyFont }}>
              <option value="">{field.placeholder}</option>
              {field.options?.map((opt: string, i: number) => <option key={i} value={opt}>{opt}</option>)}
            </select>
          ) : (
            <input type={field.type} placeholder={field.placeholder} style={{ width: '100%', padding: '0.875rem', border: '2px solid #e5e7eb', borderRadius: `${globalStyles?.borderRadius || 8}px`, boxSizing: 'border-box', backgroundColor: styles.textColor === '#ffffff' ? 'rgba(255,255,255,0.1)' : 'white', color: styles.textColor, fontFamily: globalStyles?.bodyFont }} />
          )}
        </div>
      ))}
      <button type="submit" style={{ padding: '1rem 2rem', backgroundColor: globalStyles?.primaryColor || '#0ea5e9', color: 'white', border: 'none', borderRadius: `${globalStyles?.borderRadius || 8}px`, fontSize: '1.125rem', fontWeight: 600, cursor: 'pointer', transition: 'transform 0.2s' }} className="hover:scale-105">{content.submitText}</button>
    </form>
  </div>
);

const FooterSection = ({ content, styles, isPreview, onUpdate, globalStyles }: any) => (
  <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
      <div>
        {content.logo ? <img src={content.logo} alt={content.companyName} style={{ height: '40px', marginBottom: '1rem' }} /> : (
          <div style={{ width: '3rem', height: '3rem', background: `linear-gradient(135deg, ${globalStyles?.primaryColor || '#0ea5e9'}, ${globalStyles?.secondaryColor || '#8b5cf6'})`, borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', marginBottom: '1rem' }}>{content.companyName?.charAt(0) || 'L'}</div>
        )}
        <p style={{ opacity: 0.7, lineHeight: 1.8, fontFamily: globalStyles?.bodyFont }}>{content.description}</p>
      </div>
      {content.links.map((group: any) => (
        <div key={group.id}>
          <h4 style={{ fontWeight: 600, marginBottom: '1rem', fontFamily: globalStyles?.headingFont }}>{group.title}</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {group.items.map((item: any, i: number) => <li key={i} style={{ marginBottom: '0.75rem' }}><a href={item.url} style={{ opacity: 0.7, textDecoration: 'none', color: 'inherit', transition: 'opacity 0.2s' }} className="hover:opacity-100">{item.label}</a></li>)}
          </ul>
        </div>
      ))}
    </div>
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', textAlign: 'center' }}>
      <p style={{ opacity: 0.7, fontSize: '0.875rem' }}>{content.copyright}</p>
    </div>
  </div>
);

const VideoSection = ({ content, styles, isPreview, onUpdate, globalStyles }: any) => (
  <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: globalStyles?.headingFont }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => onUpdate({ ...content, title: e.currentTarget.textContent })}>{content.title}</h2>
    </div>
    <div style={{ position: 'relative', paddingBottom: content.aspectRatio === '4:3' ? '75%' : '56.25%', borderRadius: `${globalStyles?.borderRadius || 8}px`, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
      <iframe src={content.videoUrl} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
    </div>
    {!isPreview && <input type="text" value={content.videoUrl} onChange={(e) => onUpdate({ ...content, videoUrl: e.target.value })} placeholder="YouTube埋め込みURL" className="w-full mt-4 px-4 py-3 border border-gray-200 rounded-lg" />}
  </div>
);

const GallerySection = ({ content, styles, isPreview, onUpdate, globalStyles }: any) => {
  const updateImage = (id: string, updates: any) => onUpdate({ ...content, images: content.images.map((img: any) => img.id === id ? { ...img, ...updates } : img) });
  const addImage = () => onUpdate({ ...content, images: [...content.images, { id: generateId(), url: '', caption: '新しい画像' }] });
  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
      {content.title && <div style={{ textAlign: 'center', marginBottom: '2rem' }}><h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: globalStyles?.headingFont }}>{content.title}</h2></div>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${content.columns || 3}, 1fr)`, gap: `${content.gap || 16}px` }}>
        {content.images.map((img: any) => (
          <div key={img.id} style={{ position: 'relative', aspectRatio: content.aspectRatio === '1:1' ? '1' : content.aspectRatio === '16:9' ? '16/9' : '4/3', borderRadius: `${globalStyles?.borderRadius || 8}px`, overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
            {img.url ? <img src={img.url} alt={img.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} className="hover:scale-110" /> : (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}><Image size={32} /><span style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>{img.caption}</span></div>
            )}
            {!isPreview && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.8)' }}><input type="text" value={img.url} onChange={(e) => updateImage(img.id, { url: e.target.value })} placeholder="画像URL" className="w-full px-2 py-1 rounded border-none text-xs" /></div>}
          </div>
        ))}
      </div>
      {!isPreview && <div className="text-center mt-6"><button onClick={addImage} className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400"><Plus size={18} /> 画像追加</button></div>}
    </div>
  );
};

const LogosSection = ({ content, styles, isPreview, onUpdate, globalStyles }: any) => (
  <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
    {content.title && <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem', textAlign: 'center', opacity: 0.6, fontFamily: globalStyles?.headingFont }}>{content.title}</h2>}
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '3rem' }}>
      {content.logos.map((logo: any) => (
        <div key={logo.id} style={{ padding: '1rem', opacity: 0.5, transition: 'opacity 0.3s' }} className="hover:opacity-100">
          {logo.url ? <img src={logo.url} alt={logo.name} style={{ height: '40px', objectFit: 'contain' }} /> : (
            <div style={{ padding: '1rem 2rem', backgroundColor: styles.backgroundColor === '#ffffff' ? '#f1f5f9' : 'rgba(255,255,255,0.1)', borderRadius: `${globalStyles?.borderRadius || 8}px`, fontWeight: 600, color: '#64748b' }}>{logo.name}</div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const DividerSection = ({ content, styles }: any) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem 0' }}>
    {content.pattern === 'dots' ? (
      <div style={{ display: 'flex', gap: '8px' }}>{[...Array(5)].map((_, i) => <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: content.color }} />)}</div>
    ) : content.pattern === 'gradient' ? (
      <div style={{ width: '100%', height: `${content.width}px`, background: `linear-gradient(to right, transparent, ${content.color}, transparent)` }} />
    ) : (
      <div style={{ width: '100%', height: `${content.width}px`, backgroundColor: content.color, borderStyle: content.style }} />
    )}
  </div>
);

const SpacerSection = ({ content }: any) => <div style={{ height: content.height }} />;

// NEW SECTION TYPES
const ComparisonSection = ({ content, styles, isPreview, onUpdate, globalStyles }: any) => (
  <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: globalStyles?.headingFont }}>{content.title}</h2>
    </div>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: `${globalStyles?.borderRadius || 8}px`, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: globalStyles?.primaryColor || '#0ea5e9', color: 'white' }}>
            {content.headers.map((header: string, i: number) => (
              <th key={i} style={{ padding: '1rem 1.5rem', textAlign: i === 0 ? 'left' : 'center', fontWeight: 600, fontFamily: globalStyles?.headingFont }}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content.rows.map((row: any, i: number) => (
            <tr key={i} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: i % 2 === 0 ? 'white' : '#f8fafc' }}>
              <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: '#1f2937', fontFamily: globalStyles?.bodyFont }}>{row.feature}</td>
              {row.values.map((val: string, j: number) => (
                <td key={j} style={{ padding: '1rem 1.5rem', textAlign: 'center', color: val === '○' ? '#22c55e' : val === '×' ? '#ef4444' : '#1f2937' }}>
                  {val === '○' ? <Check size={20} className="mx-auto text-green-500" /> : val === '×' ? <X size={20} className="mx-auto text-red-500" /> : val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TimelineSection = ({ content, styles, isPreview, onUpdate, globalStyles }: any) => {
  const updateItem = (id: string, updates: any) => onUpdate({ ...content, items: content.items.map((item: any) => item.id === id ? { ...item, ...updates } : item) });
  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: globalStyles?.headingFont }}>{content.title}</h2>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', backgroundColor: globalStyles?.primaryColor || '#0ea5e9', transform: 'translateX(-50%)', opacity: 0.3 }} />
        {content.items.map((item: any, idx: number) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem', flexDirection: idx % 2 === 0 ? 'row' : 'row-reverse' }}>
            <div style={{ flex: 1, textAlign: idx % 2 === 0 ? 'right' : 'left', paddingRight: idx % 2 === 0 ? '2rem' : 0, paddingLeft: idx % 2 === 1 ? '2rem' : 0 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', fontFamily: globalStyles?.headingFont }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => updateItem(item.id, { title: e.currentTarget.textContent })}>{item.title}</h3>
              <p style={{ opacity: 0.7, fontFamily: globalStyles?.bodyFont }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => updateItem(item.id, { description: e.currentTarget.textContent })}>{item.description}</p>
            </div>
            <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: `linear-gradient(135deg, ${globalStyles?.primaryColor || '#0ea5e9'}, ${globalStyles?.secondaryColor || '#8b5cf6'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, zIndex: 10, boxShadow: '0 4px 14px rgba(14,165,233,0.4)' }}>
              <DynamicIcon name={item.icon} size={24} />
            </div>
            <div style={{ flex: 1 }} />
          </div>
        ))}
      </div>
    </div>
  );
};

const CountdownSection = ({ content, styles, isPreview, onUpdate, globalStyles }: any) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(content.targetDate).getTime();
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) { setExpired(true); clearInterval(timer); }
      else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [content.targetDate]);
  if (expired) return <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.5rem', fontFamily: globalStyles?.headingFont }}>{content.expiredMessage}</div>;
  return (
    <div style={{ textAlign: 'center', maxWidth: '48rem', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', fontFamily: globalStyles?.headingFont }}>{content.title}</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { value: timeLeft.days, label: content.labels?.days || '日' },
          { value: timeLeft.hours, label: content.labels?.hours || '時間' },
          { value: timeLeft.minutes, label: content.labels?.minutes || '分' },
          { value: timeLeft.seconds, label: content.labels?.seconds || '秒' }
        ].map((item, i) => (
          <div key={i} style={{ padding: '1.5rem 2rem', background: `linear-gradient(135deg, ${globalStyles?.primaryColor || '#0ea5e9'}, ${globalStyles?.secondaryColor || '#8b5cf6'})`, borderRadius: `${globalStyles?.borderRadius || 8}px`, color: 'white', minWidth: '100px' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: 1 }}>{String(item.value).padStart(2, '0')}</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '0.5rem' }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TeamSection = ({ content, styles, isPreview, onUpdate, globalStyles }: any) => (
  <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: globalStyles?.headingFont }}>{content.title}</h2>
      {content.subtitle && <p style={{ opacity: 0.7, fontFamily: globalStyles?.bodyFont }}>{content.subtitle}</p>}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${styles.columns || 4}, 1fr)`, gap: `${styles.gap || 32}px` }}>
      {content.members.map((member: any) => (
        <div key={member.id} style={{ textAlign: 'center' }}>
          <div style={{ width: '150px', height: '150px', margin: '0 auto 1rem', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
            {member.image ? <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${globalStyles?.primaryColor || '#0ea5e9'}, ${globalStyles?.secondaryColor || '#8b5cf6'})`, color: 'white', fontSize: '3rem', fontWeight: 'bold' }}>{member.name.charAt(0)}</div>
            )}
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem', fontFamily: globalStyles?.headingFont }}>{member.name}</h3>
          <p style={{ color: globalStyles?.primaryColor || '#0ea5e9', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{member.role}</p>
          <p style={{ fontSize: '0.875rem', opacity: 0.7, lineHeight: 1.6, fontFamily: globalStyles?.bodyFont }}>{member.bio}</p>
        </div>
      ))}
    </div>
  </div>
);

const MapSection = ({ content, styles, isPreview, onUpdate, globalStyles }: any) => (
  <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: globalStyles?.headingFont }}>{content.title}</h2>
      {content.address && <p style={{ opacity: 0.7, fontFamily: globalStyles?.bodyFont }}>{content.address}</p>}
    </div>
    <div style={{ position: 'relative', paddingBottom: '50%', borderRadius: `${globalStyles?.borderRadius || 8}px`, overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
      {content.embedUrl ? (
        <iframe src={content.embedUrl} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
          <div style={{ textAlign: 'center' }}><MapPin size={48} /><p style={{ marginTop: '1rem' }}>Google Maps埋め込みURLを設定してください</p></div>
        </div>
      )}
    </div>
    {!isPreview && <input type="text" value={content.embedUrl || ''} onChange={(e) => onUpdate({ ...content, embedUrl: e.target.value })} placeholder="Google Maps埋め込みURL" className="w-full mt-4 px-4 py-3 border border-gray-200 rounded-lg" />}
  </div>
);

const CustomHTMLSection = ({ content, styles, isPreview, onUpdate }: any) => (
  <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
    {isPreview ? (
      <div dangerouslySetInnerHTML={{ __html: content.html }} />
    ) : (
      <div>
        <textarea
          value={content.html}
          onChange={(e) => onUpdate({ ...content, html: e.target.value })}
          placeholder="HTMLを入力..."
          className="w-full h-48 px-4 py-3 font-mono text-sm bg-slate-900 text-green-400 border border-slate-700 rounded-lg"
        />
        <div className="mt-4 p-4 bg-white rounded-lg border" dangerouslySetInnerHTML={{ __html: content.html }} />
      </div>
    )}
  </div>
);

const TextBlockSection = ({ content, styles, isPreview, onUpdate, globalStyles }: any) => (
  <div style={{ maxWidth: styles.layout === 'narrow' ? '48rem' : '72rem', margin: '0 auto', textAlign: styles.textAlign as any }}>
    {isPreview ? (
      <div dangerouslySetInnerHTML={{ __html: content.content }} style={{ lineHeight: 1.8, fontFamily: globalStyles?.bodyFont }} />
    ) : (
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onUpdate({ ...content, content: e.currentTarget.innerHTML })}
        style={{ lineHeight: 1.8, fontFamily: globalStyles?.bodyFont, minHeight: '100px', outline: 'none' }}
        dangerouslySetInnerHTML={{ __html: content.content }}
      />
    )}
  </div>
);

const ImageTextSection = ({ content, styles, isPreview, onUpdate, globalStyles }: any) => (
  <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexDirection: content.imagePosition === 'right' ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
      <div style={{ flex: `0 0 ${content.imageWidth || 50}%`, maxWidth: `${content.imageWidth || 50}%` }}>
        <div style={{ aspectRatio: '4/3', borderRadius: `${globalStyles?.borderRadius || 8}px`, overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
          {content.image ? <img src={content.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}><Image size={48} /></div>
          )}
        </div>
        {!isPreview && <input type="text" value={content.image || ''} onChange={(e) => onUpdate({ ...content, image: e.target.value })} placeholder="画像URL" className="w-full mt-2 px-3 py-2 border border-gray-200 rounded text-sm" />}
      </div>
      <div style={{ flex: 1, minWidth: '300px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: globalStyles?.headingFont }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => onUpdate({ ...content, heading: e.currentTarget.textContent })}>{content.heading}</h2>
        <p style={{ opacity: 0.7, lineHeight: 1.8, marginBottom: '1.5rem', fontFamily: globalStyles?.bodyFont }} contentEditable={!isPreview} suppressContentEditableWarning onBlur={(e) => onUpdate({ ...content, content: e.currentTarget.textContent })}>{content.content}</p>
        {content.ctaText && <a href={content.ctaLink} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: globalStyles?.primaryColor || '#0ea5e9', fontWeight: 600, textDecoration: 'none' }}>{content.ctaText} <ChevronRight size={18} /></a>}
      </div>
    </div>
  </div>
);

// ============================================
// ADVANCED STYLE EDITOR
// ============================================
const StyleEditor = ({ section, onUpdate, onClose, globalStyles }: { section: Section; onUpdate: (updates: Partial<Section>) => void; onClose: () => void; globalStyles: GlobalStyles }) => {
  const [activeTab, setActiveTab] = useState<'background' | 'typography' | 'spacing' | 'effects' | 'layout'>('background');
  const [styles, setStyles] = useState(section.styles);
  const [content, setContent] = useState(section.content);

  const updateStyles = (updates: Partial<SectionStyles>) => {
    const newStyles = { ...styles, ...updates };
    setStyles(newStyles);
    onUpdate({ styles: newStyles });
  };

  const updateContent = (updates: any) => {
    const newContent = { ...content, ...updates };
    setContent(newContent);
    onUpdate({ content: newContent });
  };

  const tabs = [
    { id: 'background', label: '背景', Icon: Palette },
    { id: 'typography', label: '文字', Icon: Type },
    { id: 'spacing', label: '余白', Icon: Square },
    { id: 'effects', label: '効果', Icon: Sparkles },
    { id: 'layout', label: 'レイアウト', Icon: Grid },
  ];

  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 bg-slate-900 border-l border-slate-700 overflow-y-auto z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-900 z-10">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Settings size={18} /> スタイル設定
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
      </div>

      <div className="flex border-b border-slate-700 sticky top-14 bg-slate-900 z-10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 text-xs flex flex-col items-center gap-1 transition-colors ${activeTab === tab.id ? 'text-sky-400 border-b-2 border-sky-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <tab.Icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 flex-1">
        {activeTab === 'background' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs mb-2 uppercase">背景タイプ</label>
              <div className="grid grid-cols-3 gap-2">
                {['solid', 'gradient', 'image'].map(type => (
                  <button
                    key={type}
                    onClick={() => updateStyles({ backgroundType: type as any })}
                    className={`py-2 px-3 rounded text-xs transition-colors ${styles.backgroundType === type ? 'bg-sky-600 text-white' : 'bg-slate-800 text-gray-400 hover:bg-slate-700'}`}
                  >
                    {type === 'solid' ? '単色' : type === 'gradient' ? 'グラデ' : '画像'}
                  </button>
                ))}
              </div>
            </div>

            {styles.backgroundType === 'solid' && (
              <div>
                <label className="block text-gray-400 text-xs mb-2 uppercase">背景色</label>
                <div className="flex gap-2">
                  <input type="color" value={styles.backgroundColor} onChange={(e) => updateStyles({ backgroundColor: e.target.value })} className="w-12 h-10 rounded cursor-pointer" />
                  <input type="text" value={styles.backgroundColor} onChange={(e) => updateStyles({ backgroundColor: e.target.value })} className="flex-1 px-3 bg-slate-800 border border-slate-600 rounded text-white text-sm" />
                </div>
              </div>
            )}

            {styles.backgroundType === 'gradient' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-400 text-xs mb-2 uppercase">グラデーション色</label>
                  <div className="flex gap-2">
                    <input type="color" value={styles.gradientFrom} onChange={(e) => updateStyles({ gradientFrom: e.target.value })} className="w-10 h-10 rounded" />
                    <input type="color" value={styles.gradientTo} onChange={(e) => updateStyles({ gradientTo: e.target.value })} className="w-10 h-10 rounded" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-2 uppercase">角度: {styles.gradientAngle}°</label>
                  <input type="range" min="0" max="360" value={styles.gradientAngle} onChange={(e) => updateStyles({ gradientAngle: parseInt(e.target.value) })} className="w-full" />
                </div>
              </div>
            )}

            {styles.backgroundType === 'image' && (
              <div className="space-y-3">
                <ImageUploader value={styles.backgroundImage} onChange={(v) => updateStyles({ backgroundImage: v })} label="背景画像" />
                <div>
                  <label className="block text-gray-400 text-xs mb-2 uppercase">オーバーレイ</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={styles.backgroundOverlay} onChange={(e) => updateStyles({ backgroundOverlay: e.target.value })} className="w-10 h-10 rounded" />
                    <input type="range" min="0" max="1" step="0.1" value={styles.backgroundOverlayOpacity} onChange={(e) => updateStyles({ backgroundOverlayOpacity: parseFloat(e.target.value) })} className="flex-1" />
                    <span className="text-gray-400 text-xs w-10">{Math.round(styles.backgroundOverlayOpacity * 100)}%</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-400 text-xs mb-2 uppercase">テキスト色</label>
              <div className="flex gap-2">
                <input type="color" value={styles.textColor} onChange={(e) => updateStyles({ textColor: e.target.value })} className="w-12 h-10 rounded cursor-pointer" />
                <input type="text" value={styles.textColor} onChange={(e) => updateStyles({ textColor: e.target.value })} className="flex-1 px-3 bg-slate-800 border border-slate-600 rounded text-white text-sm" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs mb-2 uppercase">フォント</label>
              <select value={styles.font.family} onChange={(e) => updateStyles({ font: { ...styles.font, family: e.target.value } })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm">
                {GOOGLE_FONTS.map(font => <option key={font} value={font}>{font}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 text-xs mb-2 uppercase">サイズ</label>
                <input type="number" value={styles.font.size} onChange={(e) => updateStyles({ font: { ...styles.font, size: parseInt(e.target.value) } })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-2 uppercase">太さ</label>
                <select value={styles.font.weight} onChange={(e) => updateStyles({ font: { ...styles.font, weight: parseInt(e.target.value) } })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm">
                  {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 text-xs mb-2 uppercase">行間</label>
                <input type="number" step="0.1" value={styles.font.lineHeight} onChange={(e) => updateStyles({ font: { ...styles.font, lineHeight: parseFloat(e.target.value) } })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-2 uppercase">字間</label>
                <input type="number" step="0.1" value={styles.font.letterSpacing} onChange={(e) => updateStyles({ font: { ...styles.font, letterSpacing: parseFloat(e.target.value) } })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-2 uppercase">テキスト配置</label>
              <div className="flex gap-1">
                {[{ v: 'left', I: AlignLeft }, { v: 'center', I: AlignCenter }, { v: 'right', I: AlignRight }, { v: 'justify', I: AlignJustify }].map(({ v, I }) => (
                  <button key={v} onClick={() => updateStyles({ textAlign: v as any })} className={`flex-1 py-2 rounded flex justify-center ${styles.textAlign === v ? 'bg-sky-600 text-white' : 'bg-slate-800 text-gray-400'}`}><I size={18} /></button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'spacing' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs mb-2 uppercase">パディング (内側余白)</label>
              <div className="grid grid-cols-2 gap-2">
                {['top', 'right', 'bottom', 'left'].map(side => (
                  <div key={side} className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs w-8">{side === 'top' ? '上' : side === 'right' ? '右' : side === 'bottom' ? '下' : '左'}</span>
                    <input type="number" value={styles.padding[side as keyof SpacingValue]} onChange={(e) => updateStyles({ padding: { ...styles.padding, [side]: parseInt(e.target.value) || 0 } })} className="flex-1 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-2 uppercase">マージン (外側余白)</label>
              <div className="grid grid-cols-2 gap-2">
                {['top', 'right', 'bottom', 'left'].map(side => (
                  <div key={side} className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs w-8">{side === 'top' ? '上' : side === 'right' ? '右' : side === 'bottom' ? '下' : '左'}</span>
                    <input type="number" value={styles.margin[side as keyof SpacingValue]} onChange={(e) => updateStyles({ margin: { ...styles.margin, [side]: parseInt(e.target.value) || 0 } })} className="flex-1 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-2 uppercase">最小高さ</label>
              <input type="number" value={styles.minHeight} onChange={(e) => updateStyles({ minHeight: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm" placeholder="0 = 自動" />
            </div>
          </div>
        )}

        {activeTab === 'effects' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs mb-2 uppercase">ボーダー</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <input type="number" value={styles.border.width} onChange={(e) => updateStyles({ border: { ...styles.border, width: parseInt(e.target.value) || 0 } })} placeholder="幅" className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm" />
                <select value={styles.border.style} onChange={(e) => updateStyles({ border: { ...styles.border, style: e.target.value } })} className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm">
                  <option value="solid">実線</option>
                  <option value="dashed">破線</option>
                  <option value="dotted">点線</option>
                </select>
                <input type="color" value={styles.border.color} onChange={(e) => updateStyles({ border: { ...styles.border, color: e.target.value } })} className="w-full h-8 rounded" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">角丸: {styles.border.radius}px</label>
                <input type="range" min="0" max="50" value={styles.border.radius} onChange={(e) => updateStyles({ border: { ...styles.border, radius: parseInt(e.target.value) } })} className="w-full" />
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-2 uppercase">シャドウ</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={styles.shadow.x} onChange={(e) => updateStyles({ shadow: { ...styles.shadow, x: parseInt(e.target.value) || 0 } })} placeholder="X" className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm" />
                <input type="number" value={styles.shadow.y} onChange={(e) => updateStyles({ shadow: { ...styles.shadow, y: parseInt(e.target.value) || 0 } })} placeholder="Y" className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm" />
                <input type="number" value={styles.shadow.blur} onChange={(e) => updateStyles({ shadow: { ...styles.shadow, blur: parseInt(e.target.value) || 0 } })} placeholder="ぼかし" className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm" />
                <input type="number" value={styles.shadow.spread} onChange={(e) => updateStyles({ shadow: { ...styles.shadow, spread: parseInt(e.target.value) || 0 } })} placeholder="広がり" className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm" />
              </div>
              <input type="color" value={styles.shadow.color.replace(/rgba?\([^)]+\)/, '#000000')} onChange={(e) => updateStyles({ shadow: { ...styles.shadow, color: e.target.value + '40' } })} className="w-full h-8 rounded mt-2" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-2 uppercase">アニメーション</label>
              <select value={styles.animation} onChange={(e) => updateStyles({ animation: e.target.value })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm">
                {ANIMATIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
              {styles.animation !== 'none' && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="block text-gray-500 text-xs mb-1">時間(秒)</label>
                    <input type="number" step="0.1" value={styles.animationDuration} onChange={(e) => updateStyles({ animationDuration: parseFloat(e.target.value) })} className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-xs mb-1">遅延(秒)</label>
                    <input type="number" step="0.1" value={styles.animationDelay} onChange={(e) => updateStyles({ animationDelay: parseFloat(e.target.value) })} className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs mb-2 uppercase">コンテンツ幅</label>
              <div className="grid grid-cols-3 gap-2">
                {[{ v: 'full', l: '全幅' }, { v: 'contained', l: '標準' }, { v: 'narrow', l: '狭い' }].map(({ v, l }) => (
                  <button key={v} onClick={() => updateStyles({ layout: v as any })} className={`py-2 rounded text-xs ${styles.layout === v ? 'bg-sky-600 text-white' : 'bg-slate-800 text-gray-400'}`}>{l}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 text-xs mb-2 uppercase">カラム数</label>
                <input type="number" min="1" max="6" value={styles.columns} onChange={(e) => updateStyles({ columns: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-2 uppercase">間隔(px)</label>
                <input type="number" value={styles.gap} onChange={(e) => updateStyles({ gap: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-2 uppercase">縦位置</label>
              <div className="grid grid-cols-3 gap-2">
                {[{ v: 'top', l: '上' }, { v: 'center', l: '中央' }, { v: 'bottom', l: '下' }].map(({ v, l }) => (
                  <button key={v} onClick={() => updateStyles({ verticalAlign: v as any })} className={`py-2 rounded text-xs ${styles.verticalAlign === v ? 'bg-sky-600 text-white' : 'bg-slate-800 text-gray-400'}`}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-2 uppercase">レスポンシブ表示</label>
              <div className="space-y-2">
                {[{ key: 'hideOnMobile', l: 'モバイルで非表示' }, { key: 'hideOnTablet', l: 'タブレットで非表示' }, { key: 'hideOnDesktop', l: 'デスクトップで非表示' }].map(({ key, l }) => (
                  <label key={key} className="flex items-center gap-2 text-gray-400 text-sm cursor-pointer">
                    <input type="checkbox" checked={styles[key as keyof SectionStyles] as boolean} onChange={(e) => updateStyles({ [key]: e.target.checked })} className="rounded" />
                    {l}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// GLOBAL STYLES EDITOR
// ============================================
const GlobalStylesEditor = ({ globalStyles, onChange, onClose }: { globalStyles: GlobalStyles; onChange: (styles: GlobalStyles) => void; onClose: () => void }) => {
  const [styles, setStyles] = useState(globalStyles);
  const update = (updates: Partial<GlobalStyles>) => {
    const newStyles = { ...styles, ...updates };
    setStyles(newStyles);
    onChange(newStyles);
  };
  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 bg-slate-900 border-l border-slate-700 overflow-y-auto z-50">
      <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-900">
        <h3 className="text-white font-semibold flex items-center gap-2"><Droplet size={18} /> グローバルスタイル</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-gray-400 text-xs mb-2 uppercase">カラーパレット</label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {COLOR_PALETTES.map(palette => (
              <button key={palette.name} onClick={() => update({ primaryColor: palette.colors[0], secondaryColor: palette.colors[1], accentColor: palette.colors[2] })} className="group relative" title={palette.name}>
                <div className="flex h-6 rounded overflow-hidden">
                  {palette.colors.slice(0, 3).map((c, i) => <div key={i} style={{ backgroundColor: c, flex: 1 }} />)}
                </div>
              </button>
            ))}
          </div>
        </div>
        {[
          { key: 'primaryColor', label: 'メインカラー' },
          { key: 'secondaryColor', label: 'サブカラー' },
          { key: 'accentColor', label: 'アクセントカラー' },
          { key: 'backgroundColor', label: '背景色' },
          { key: 'textColor', label: 'テキスト色' },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block text-gray-400 text-xs mb-2 uppercase">{label}</label>
            <div className="flex gap-2">
              <input type="color" value={styles[key as keyof GlobalStyles] as string} onChange={(e) => update({ [key]: e.target.value })} className="w-12 h-10 rounded" />
              <input type="text" value={styles[key as keyof GlobalStyles] as string} onChange={(e) => update({ [key]: e.target.value })} className="flex-1 px-3 bg-slate-800 border border-slate-600 rounded text-white text-sm" />
            </div>
          </div>
        ))}
        <div>
          <label className="block text-gray-400 text-xs mb-2 uppercase">見出しフォント</label>
          <select value={styles.headingFont} onChange={(e) => update({ headingFont: e.target.value })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm">
            {GOOGLE_FONTS.map(font => <option key={font} value={font}>{font}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-400 text-xs mb-2 uppercase">本文フォント</label>
          <select value={styles.bodyFont} onChange={(e) => update({ bodyFont: e.target.value })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm">
            {GOOGLE_FONTS.map(font => <option key={font} value={font}>{font}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-400 text-xs mb-2 uppercase">角丸(px)</label>
            <input type="number" value={styles.borderRadius} onChange={(e) => update({ borderRadius: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-2 uppercase">基本間隔(px)</label>
            <input type="number" value={styles.spacing} onChange={(e) => update({ spacing: parseInt(e.target.value) || 16 })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TEMPLATE SELECTOR
// ============================================
const TemplateSelector = ({ onSelect, onClose }: { onSelect: (key: string) => void; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
    <div className="bg-slate-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-2xl font-bold">テンプレートを選択</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(templates).map(([key, template]) => (
          <button key={key} onClick={() => { onSelect(key); onClose(); }} className="group p-6 rounded-xl border-2 border-slate-700 hover:border-sky-500 text-left transition-all hover:scale-105">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-sky-600 transition-colors">
              <template.Icon size={24} className="text-sky-400 group-hover:text-white" />
            </div>
            <h3 className="text-white font-semibold mb-1">{template.name}</h3>
            <p className="text-gray-400 text-sm">{template.desc}</p>
            <p className="text-gray-500 text-xs mt-2">{template.sections.length} セクション</p>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ============================================
// EXPORT FUNCTIONS
// ============================================
const exportToHTML = (sections: Section[], globalStyles: GlobalStyles, pageTitle: string) => {
  const fontFamilies = [...new Set([globalStyles.headingFont, globalStyles.bodyFont])];
  const fontUrl = `https://fonts.googleapis.com/css2?${fontFamilies.map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700`).join('&')}&display=swap`;
  
  const getPadding = (p: SpacingValue) => `${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`;
  const getMargin = (m: SpacingValue) => `${m.top}px ${m.right}px ${m.bottom}px ${m.left}px`;
  const getBg = (s: SectionStyles) => {
    if (s.backgroundType === 'gradient') return `background: linear-gradient(${s.gradientAngle}deg, ${s.gradientFrom}, ${s.gradientTo});`;
    if (s.backgroundType === 'image' && s.backgroundImage) return `background-image: url(${s.backgroundImage}); background-size: cover; background-position: center;`;
    return `background-color: ${s.backgroundColor};`;
  };
  const getBorder = (b: BorderValue) => b.width > 0 ? `border: ${b.width}px ${b.style} ${b.color}; border-radius: ${b.radius}px;` : `border-radius: ${b.radius}px;`;
  const getShadow = (s: ShadowValue) => s.blur > 0 || s.spread > 0 ? `box-shadow: ${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color};` : '';

  const renderSection = (sec: Section): string => {
    const { type, content: c, styles: s } = sec;
    const baseStyle = `${getBg(s)} color: ${s.textColor}; padding: ${getPadding(s.padding)}; margin: ${getMargin(s.margin)}; ${getBorder(s.border)} ${getShadow(s.shadow)} ${s.minHeight ? `min-height: ${s.minHeight}px;` : ''}`;
    const containerStyle = `max-width: ${s.layout === 'narrow' ? '48rem' : s.layout === 'contained' ? '72rem' : '100%'}; margin: 0 auto; text-align: ${s.textAlign};`;

    const sectionRenderers: Record<SectionType, () => string> = {
      hero: () => `<section style="${baseStyle} position: relative; min-height: ${s.minHeight || 600}px; display: flex; align-items: center; justify-content: center;">${s.backgroundType === 'image' && s.backgroundOverlayOpacity > 0 ? `<div style="position: absolute; inset: 0; background-color: ${s.backgroundOverlay}; opacity: ${s.backgroundOverlayOpacity};"></div>` : ''}<div style="position: relative; z-index: 10; ${containerStyle} padding: 2rem;"><h1 style="font-size: clamp(2rem, 6vw, ${c.titleFont?.size || 56}px); font-weight: ${c.titleFont?.weight || 700}; font-family: '${c.titleFont?.family || globalStyles.headingFont}', sans-serif; margin-bottom: 1.5rem; line-height: 1.1; white-space: pre-line;">${c.title}</h1><p style="font-size: clamp(1rem, 2vw, ${c.subtitleFont?.size || 20}px); opacity: 0.9; margin-bottom: 2.5rem; max-width: 600px; ${s.textAlign === 'center' ? 'margin-left: auto; margin-right: auto;' : ''}">${c.subtitle}</p><div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: ${s.textAlign === 'center' ? 'center' : s.textAlign === 'right' ? 'flex-end' : 'flex-start'};"><a href="${c.ctaLink}" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2rem; background-color: ${globalStyles.primaryColor}; color: white; border-radius: ${globalStyles.borderRadius}px; font-size: 1.125rem; font-weight: 600; text-decoration: none;">${c.ctaText} →</a>${c.secondaryCtaText ? `<a href="${c.secondaryCtaLink}" style="display: inline-flex; padding: 1rem 2rem; background: transparent; color: inherit; border: 2px solid currentColor; border-radius: ${globalStyles.borderRadius}px; font-weight: 600; text-decoration: none;">${c.secondaryCtaText}</a>` : ''}</div></div></section>`,
      features: () => `<section style="${baseStyle}"><div style="${containerStyle}"><div style="text-align: center; margin-bottom: 3rem;"><h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem; font-family: '${globalStyles.headingFont}', sans-serif;">${c.title}</h2><p style="opacity: 0.7; max-width: 600px; margin: 0 auto;">${c.subtitle}</p></div><div style="display: grid; grid-template-columns: repeat(${s.columns || 3}, 1fr); gap: ${s.gap || 32}px;">${c.features.map((f: any) => `<div style="text-align: ${s.textAlign}; padding: 2rem; border-radius: ${globalStyles.borderRadius}px; background: ${s.backgroundColor === '#ffffff' ? 'rgba(14,165,233,0.05)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${s.backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'};"><div style="width: 4rem; height: 4rem; margin: ${s.textAlign === 'center' ? '0 auto 1.5rem' : '0 0 1.5rem'}; background: linear-gradient(135deg, ${globalStyles.primaryColor}, ${globalStyles.secondaryColor}); border-radius: 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">✦</div><h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem;">${f.title}</h3><p style="opacity: 0.7; line-height: 1.7;">${f.description}</p></div>`).join('')}</div></div></section>`,
      stats: () => `<section style="${baseStyle}"><div style="${containerStyle}">${c.title ? `<h2 style="font-size: 2rem; font-weight: bold; margin-bottom: 3rem; text-align: center;">${c.title}</h2>` : ''}<div style="display: grid; grid-template-columns: repeat(${s.columns || 4}, 1fr); gap: ${s.gap || 32}px;">${c.stats.map((st: any) => `<div style="text-align: center; padding: 1.5rem;"><div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem; background: linear-gradient(135deg, ${globalStyles.primaryColor}, ${globalStyles.secondaryColor}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${st.value}</div><div style="opacity: 0.7;">${st.label}</div></div>`).join('')}</div></div></section>`,
      testimonials: () => `<section style="${baseStyle}"><div style="${containerStyle}"><div style="text-align: center; margin-bottom: 3rem;"><h2 style="font-size: 2.5rem; font-weight: bold;">${c.title}</h2></div><div style="display: grid; grid-template-columns: repeat(${s.columns || 2}, 1fr); gap: ${s.gap || 32}px;">${c.testimonials.map((t: any) => `<div style="background: ${s.backgroundColor === '#ffffff' ? '#f8fafc' : 'rgba(255,255,255,0.05)'}; padding: 2rem; border-radius: ${globalStyles.borderRadius}px;"><div style="margin-bottom: 1rem; color: #fbbf24;">${'★'.repeat(t.rating)}${'☆'.repeat(5-t.rating)}</div><p style="font-size: 1.125rem; line-height: 1.8; margin-bottom: 1.5rem;">${t.content}</p><div style="display: flex; align-items: center; gap: 1rem;"><div style="width: 3rem; height: 3rem; border-radius: 50%; background: ${globalStyles.primaryColor}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${t.name.charAt(0)}</div><div><div style="font-weight: 600;">${t.name}</div><div style="font-size: 0.875rem; opacity: 0.7;">${t.role}${t.company ? ` / ${t.company}` : ''}</div></div></div></div>`).join('')}</div></div></section>`,
      pricing: () => `<section style="${baseStyle}"><div style="${containerStyle}"><div style="text-align: center; margin-bottom: 3rem;"><h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem;">${c.title}</h2><p style="opacity: 0.7;">${c.subtitle}</p></div><div style="display: grid; grid-template-columns: repeat(${c.plans.length}, 1fr); gap: 2rem; align-items: start;">${c.plans.map((p: any) => `<div style="padding: 2.5rem; border-radius: ${globalStyles.borderRadius * 2}px; position: relative; ${p.isPopular ? `background: linear-gradient(135deg, ${globalStyles.primaryColor}, ${globalStyles.secondaryColor}); color: white; transform: scale(1.05); box-shadow: 0 25px 50px -12px rgba(14,165,233,0.4);` : 'background: white; border: 1px solid #e5e7eb;'}">${p.isPopular ? `<div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); padding: 0.25rem 1rem; background: ${globalStyles.accentColor}; color: #1f2937; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">人気</div>` : ''}<h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">${p.name}</h3><p style="font-size: 0.875rem; opacity: 0.8; margin-bottom: 1.5rem;">${p.description}</p><div style="margin-bottom: 2rem;"><span style="font-size: 3rem; font-weight: bold;">${p.price}</span><span style="opacity: 0.7;">${p.period}</span></div><ul style="list-style: none; padding: 0; margin-bottom: 2rem;">${p.features.map((f: string) => `<li style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">✓ ${f}</li>`).join('')}</ul><button style="width: 100%; padding: 1rem; border-radius: ${globalStyles.borderRadius}px; font-weight: 600; border: none; cursor: pointer; ${p.isPopular ? `background: white; color: ${globalStyles.primaryColor};` : `background: ${globalStyles.primaryColor}; color: white;`}">${p.ctaText}</button></div>`).join('')}</div></div></section>`,
      faq: () => `<section style="${baseStyle}"><div style="max-width: 48rem; margin: 0 auto;"><div style="text-align: center; margin-bottom: 3rem;"><h2 style="font-size: 2.5rem; font-weight: bold;">${c.title}</h2></div><div style="display: flex; flex-direction: column; gap: 1rem;">${c.items.map((item: any, i: number) => `<details ${i === 0 ? 'open' : ''} style="border: 1px solid #e5e7eb; border-radius: ${globalStyles.borderRadius}px; overflow: hidden;"><summary style="padding: 1.5rem; cursor: pointer; font-weight: 600; font-size: 1.125rem; background: white; color: #1f2937; list-style: none;">${item.question}</summary><div style="padding: 0 1.5rem 1.5rem; color: #4b5563; line-height: 1.8;">${item.answer}</div></details>`).join('')}</div></div></section>`,
      cta: () => `<section style="${baseStyle}"><div style="text-align: center; max-width: 48rem; margin: 0 auto;"><h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem;">${c.title}</h2><p style="font-size: 1.25rem; opacity: 0.9; margin-bottom: 2.5rem;">${c.subtitle}</p><div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;"><a href="${c.buttonLink}" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2.5rem; background: white; color: ${globalStyles.primaryColor}; border-radius: ${globalStyles.borderRadius}px; font-size: 1.125rem; font-weight: 600; text-decoration: none; box-shadow: 0 4px 14px rgba(0,0,0,0.1);">${c.buttonText} →</a>${c.secondaryText ? `<a href="${c.secondaryLink}" style="display: inline-flex; padding: 1rem 2.5rem; background: transparent; color: white; border: 2px solid white; border-radius: ${globalStyles.borderRadius}px; font-weight: 600; text-decoration: none;">${c.secondaryText}</a>` : ''}</div></div></section>`,
      contact: () => `<section style="${baseStyle}"><div style="max-width: 40rem; margin: 0 auto;"><div style="text-align: center; margin-bottom: 3rem;"><h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem;">${c.title}</h2><p style="opacity: 0.7;">${c.subtitle}</p></div><form style="display: flex; flex-direction: column; gap: 1.5rem;">${c.fields.map((f: any) => `<div><label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">${f.label}${f.required ? ' <span style="color: #ef4444;">*</span>' : ''}</label>${f.type === 'textarea' ? `<textarea placeholder="${f.placeholder}" rows="4" style="width: 100%; padding: 0.875rem; border: 2px solid #e5e7eb; border-radius: ${globalStyles.borderRadius}px; resize: none; box-sizing: border-box;"></textarea>` : f.type === 'select' ? `<select style="width: 100%; padding: 0.875rem; border: 2px solid #e5e7eb; border-radius: ${globalStyles.borderRadius}px; box-sizing: border-box;"><option value="">${f.placeholder}</option>${f.options?.map((opt: string) => `<option value="${opt}">${opt}</option>`).join('') || ''}</select>` : `<input type="${f.type}" placeholder="${f.placeholder}" style="width: 100%; padding: 0.875rem; border: 2px solid #e5e7eb; border-radius: ${globalStyles.borderRadius}px; box-sizing: border-box;">`}</div>`).join('')}<button type="submit" style="padding: 1rem 2rem; background: ${globalStyles.primaryColor}; color: white; border: none; border-radius: ${globalStyles.borderRadius}px; font-size: 1.125rem; font-weight: 600; cursor: pointer;">${c.submitText}</button></form></div></section>`,
      footer: () => `<footer style="${baseStyle}"><div style="max-width: 72rem; margin: 0 auto;"><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; margin-bottom: 3rem;"><div>${c.logo ? `<img src="${c.logo}" alt="${c.companyName}" style="height: 40px; margin-bottom: 1rem;">` : `<div style="width: 3rem; height: 3rem; background: linear-gradient(135deg, ${globalStyles.primaryColor}, ${globalStyles.secondaryColor}); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin-bottom: 1rem;">${c.companyName?.charAt(0) || 'L'}</div>`}<p style="opacity: 0.7; line-height: 1.8;">${c.description}</p></div>${c.links.map((g: any) => `<div><h4 style="font-weight: 600; margin-bottom: 1rem;">${g.title}</h4><ul style="list-style: none; padding: 0; margin: 0;">${g.items.map((i: any) => `<li style="margin-bottom: 0.75rem;"><a href="${i.url}" style="opacity: 0.7; text-decoration: none; color: inherit;">${i.label}</a></li>`).join('')}</ul></div>`).join('')}</div><div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem; text-align: center;"><p style="opacity: 0.7; font-size: 0.875rem;">${c.copyright}</p></div></div></footer>`,
      video: () => `<section style="${baseStyle}"><div style="max-width: 56rem; margin: 0 auto;"><div style="text-align: center; margin-bottom: 2rem;"><h2 style="font-size: 2.5rem; font-weight: bold;">${c.title}</h2></div><div style="position: relative; padding-bottom: ${c.aspectRatio === '4:3' ? '75%' : '56.25%'}; border-radius: ${globalStyles.borderRadius}px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);"><iframe src="${c.videoUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div></section>`,
      gallery: () => `<section style="${baseStyle}"><div style="max-width: 72rem; margin: 0 auto;">${c.title ? `<div style="text-align: center; margin-bottom: 2rem;"><h2 style="font-size: 2.5rem; font-weight: bold;">${c.title}</h2></div>` : ''}<div style="display: grid; grid-template-columns: repeat(${c.columns || 3}, 1fr); gap: ${c.gap || 16}px;">${c.images.map((img: any) => `<div style="aspect-ratio: ${c.aspectRatio === '1:1' ? '1' : c.aspectRatio === '16:9' ? '16/9' : '4/3'}; border-radius: ${globalStyles.borderRadius}px; overflow: hidden; background: #f1f5f9;">${img.url ? `<img src="${img.url}" alt="${img.caption}" style="width: 100%; height: 100%; object-fit: cover;">` : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #94a3b8;">${img.caption}</div>`}</div>`).join('')}</div></div></section>`,
      logos: () => `<section style="${baseStyle}"><div style="max-width: 72rem; margin: 0 auto;">${c.title ? `<h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 2rem; text-align: center; opacity: 0.6;">${c.title}</h2>` : ''}<div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 3rem;">${c.logos.map((l: any) => `<div style="padding: 1rem; opacity: 0.5;">${l.url ? `<img src="${l.url}" alt="${l.name}" style="height: 40px; object-fit: contain;">` : `<div style="padding: 1rem 2rem; background: ${s.backgroundColor === '#ffffff' ? '#f1f5f9' : 'rgba(255,255,255,0.1)'}; border-radius: ${globalStyles.borderRadius}px; font-weight: 600; color: #64748b;">${l.name}</div>`}</div>`).join('')}</div></div></section>`,
      divider: () => `<div style="padding: 1rem 0;"><div style="width: 100%; height: ${c.width}px; background-color: ${c.color};"></div></div>`,
      spacer: () => `<div style="height: ${c.height}px;"></div>`,
      comparison: () => `<section style="${baseStyle}"><div style="${containerStyle}"><div style="text-align: center; margin-bottom: 3rem;"><h2 style="font-size: 2.5rem; font-weight: bold;">${c.title}</h2></div><div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; background: white; border-radius: ${globalStyles.borderRadius}px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);"><thead><tr style="background: ${globalStyles.primaryColor}; color: white;">${c.headers.map((h: string, i: number) => `<th style="padding: 1rem 1.5rem; text-align: ${i === 0 ? 'left' : 'center'}; font-weight: 600;">${h}</th>`).join('')}</tr></thead><tbody>${c.rows.map((row: any, i: number) => `<tr style="border-bottom: 1px solid #e5e7eb; background: ${i % 2 === 0 ? 'white' : '#f8fafc'};"><td style="padding: 1rem 1.5rem; font-weight: 500; color: #1f2937;">${row.feature}</td>${row.values.map((v: string) => `<td style="padding: 1rem 1.5rem; text-align: center; color: ${v === '○' ? '#22c55e' : v === '×' ? '#ef4444' : '#1f2937'};">${v === '○' ? '✓' : v === '×' ? '✗' : v}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div></section>`,
      timeline: () => `<section style="${baseStyle}"><div style="max-width: 48rem; margin: 0 auto;"><div style="text-align: center; margin-bottom: 3rem;"><h2 style="font-size: 2.5rem; font-weight: bold;">${c.title}</h2></div><div style="position: relative;">${c.items.map((item: any, i: number) => `<div style="display: flex; align-items: center; margin-bottom: 3rem; flex-direction: ${i % 2 === 0 ? 'row' : 'row-reverse'};"><div style="flex: 1; text-align: ${i % 2 === 0 ? 'right' : 'left'}; ${i % 2 === 0 ? 'padding-right' : 'padding-left'}: 2rem;"><h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${item.title}</h3><p style="opacity: 0.7;">${item.description}</p></div><div style="width: 4rem; height: 4rem; border-radius: 50%; background: linear-gradient(135deg, ${globalStyles.primaryColor}, ${globalStyles.secondaryColor}); display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; z-index: 10; box-shadow: 0 4px 14px rgba(14,165,233,0.4);">●</div><div style="flex: 1;"></div></div>`).join('')}</div></div></section>`,
      countdown: () => `<section style="${baseStyle}"><div style="text-align: center; max-width: 48rem; margin: 0 auto;"><h2 style="font-size: 2rem; font-weight: bold; margin-bottom: 2rem;">${c.title}</h2><div style="display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap;" id="countdown-${sec.id}"></div></div><script>!function(){const t=new Date("${c.targetDate}").getTime(),e=document.getElementById("countdown-${sec.id}");!function n(){const o=t-Date.now();if(o<=0)return void(e.innerHTML="${c.expiredMessage}");const a=Math.floor(o/864e5),r=Math.floor(o%864e5/36e5),s=Math.floor(o%36e5/6e4),l=Math.floor(o%6e4/1e3);e.innerHTML=[{v:a,l:"${c.labels?.days||'日'}"},{v:r,l:"${c.labels?.hours||'時間'}"},{v:s,l:"${c.labels?.minutes||'分'}"},{v:l,l:"${c.labels?.seconds||'秒'}"}].map(t=>'<div style="padding:1.5rem 2rem;background:linear-gradient(135deg,${globalStyles.primaryColor},${globalStyles.secondaryColor});border-radius:${globalStyles.borderRadius}px;color:white;min-width:100px"><div style="font-size:3rem;font-weight:bold;line-height:1">'+String(t.v).padStart(2,"0")+'</div><div style="font-size:0.875rem;opacity:0.8;margin-top:0.5rem">'+t.l+"</div></div>").join(""),setTimeout(n,1e3)}()}();</script></section>`,
      team: () => `<section style="${baseStyle}"><div style="${containerStyle}"><div style="text-align: center; margin-bottom: 3rem;"><h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem;">${c.title}</h2>${c.subtitle ? `<p style="opacity: 0.7;">${c.subtitle}</p>` : ''}</div><div style="display: grid; grid-template-columns: repeat(${s.columns || 4}, 1fr); gap: ${s.gap || 32}px;">${c.members.map((m: any) => `<div style="text-align: center;"><div style="width: 150px; height: 150px; margin: 0 auto 1rem; border-radius: 50%; overflow: hidden; background: #f1f5f9;">${m.image ? `<img src="${m.image}" alt="${m.name}" style="width: 100%; height: 100%; object-fit: cover;">` : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, ${globalStyles.primaryColor}, ${globalStyles.secondaryColor}); color: white; font-size: 3rem; font-weight: bold;">${m.name.charAt(0)}</div>`}</div><h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.25rem;">${m.name}</h3><p style="color: ${globalStyles.primaryColor}; font-size: 0.875rem; margin-bottom: 0.75rem;">${m.role}</p><p style="font-size: 0.875rem; opacity: 0.7; line-height: 1.6;">${m.bio}</p></div>`).join('')}</div></div></section>`,
      map: () => `<section style="${baseStyle}"><div style="${containerStyle}"><div style="text-align: center; margin-bottom: 2rem;"><h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem;">${c.title}</h2>${c.address ? `<p style="opacity: 0.7;">${c.address}</p>` : ''}</div><div style="position: relative; padding-bottom: 50%; border-radius: ${globalStyles.borderRadius}px; overflow: hidden; background: #f1f5f9;">${c.embedUrl ? `<iframe src="${c.embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allowfullscreen loading="lazy"></iframe>` : '<div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #94a3b8;">地図を設定してください</div>'}</div></div></section>`,
      'custom-html': () => `<section style="${baseStyle}"><div style="${containerStyle}">${c.html}</div></section>`,
      'text-block': () => `<section style="${baseStyle}"><div style="${containerStyle} line-height: 1.8;">${c.content}</div></section>`,
      'image-text': () => `<section style="${baseStyle}"><div style="max-width: 72rem; margin: 0 auto;"><div style="display: flex; align-items: center; gap: 3rem; flex-direction: ${c.imagePosition === 'right' ? 'row-reverse' : 'row'}; flex-wrap: wrap;"><div style="flex: 0 0 ${c.imageWidth || 50}%; max-width: ${c.imageWidth || 50}%;"><div style="aspect-ratio: 4/3; border-radius: ${globalStyles.borderRadius}px; overflow: hidden; background: #f1f5f9;">${c.image ? `<img src="${c.image}" alt="" style="width: 100%; height: 100%; object-fit: cover;">` : ''}</div></div><div style="flex: 1; min-width: 300px;"><h2 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">${c.heading}</h2><p style="opacity: 0.7; line-height: 1.8; margin-bottom: 1.5rem;">${c.content}</p>${c.ctaText ? `<a href="${c.ctaLink}" style="display: inline-flex; align-items: center; gap: 0.5rem; color: ${globalStyles.primaryColor}; font-weight: 600; text-decoration: none;">${c.ctaText} →</a>` : ''}</div></div></div></section>`,
    };

    return sectionRenderers[type]?.() || '';
  };

  const html = `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${pageTitle}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="${fontUrl}" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'${globalStyles.bodyFont}',sans-serif;line-height:1.6;color:${globalStyles.textColor};background:${globalStyles.backgroundColor}}h1,h2,h3,h4,h5,h6{font-family:'${globalStyles.headingFont}',sans-serif}img{max-width:100%;height:auto}a{transition:opacity 0.2s,transform 0.2s}a:hover{opacity:0.9}button{transition:transform 0.2s,box-shadow 0.2s}button:hover{transform:translateY(-2px)}details>summary{list-style:none;cursor:pointer}details>summary::-webkit-details-marker{display:none}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}@keyframes zoomIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}.animate-fadeIn{animation:fadeIn 0.6s ease-out}.animate-fadeInUp{animation:fadeInUp 0.6s ease-out}.animate-zoomIn{animation:zoomIn 0.6s ease-out}</style></head><body>${sections.map(renderSection).join('')}</body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${pageTitle.toLowerCase().replace(/\s+/g, '-')}.html`;
  a.click();
  URL.revokeObjectURL(url);
};

const exportToJSON = (sections: Section[], globalStyles: GlobalStyles, pageTitle: string) => {
  const data = { version: '2.0', pageTitle, globalStyles, sections };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${pageTitle.toLowerCase().replace(/\s+/g, '-')}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function App() {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showStyleEditor, setShowStyleEditor] = useState(false);
  const [showGlobalStyles, setShowGlobalStyles] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);
  const [pageTitle, setPageTitle] = useState('My Landing Page');
  const [globalStyles, setGlobalStyles] = useState<GlobalStyles>(defaultGlobalStyles);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [sidebarTab, setSidebarTab] = useState<'add' | 'layers'>('add');
  const [sectionCategory, setSectionCategory] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save to history
  const saveToHistory = useCallback((newSections: Section[], newGlobalStyles: GlobalStyles) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ sections: JSON.parse(JSON.stringify(newSections)), globalStyles: JSON.parse(JSON.stringify(newGlobalStyles)) });
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Undo/Redo
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const state = history[historyIndex - 1];
      setSections(state.sections);
      setGlobalStyles(state.globalStyles);
    }
  };
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const state = history[historyIndex + 1];
      setSections(state.sections);
      setGlobalStyles(state.globalStyles);
    }
  };

  // Section operations
  const addSection = (type: SectionType) => {
    const newSection: Section = { id: generateId(), type, content: getDefaultContent(type), styles: getDefaultStyles(type) };
    const newSections = [...sections, newSection];
    setSections(newSections);
    setSelectedId(newSection.id);
    saveToHistory(newSections, globalStyles);
  };

  const deleteSection = (id: string) => {
    const newSections = sections.filter(s => s.id !== id);
    setSections(newSections);
    if (selectedId === id) { setSelectedId(null); setShowStyleEditor(false); }
    saveToHistory(newSections, globalStyles);
  };

  const duplicateSection = (id: string) => {
    const idx = sections.findIndex(s => s.id === id);
    if (idx === -1) return;
    const newSection = { ...JSON.parse(JSON.stringify(sections[idx])), id: generateId() };
    const newSections = [...sections.slice(0, idx + 1), newSection, ...sections.slice(idx + 1)];
    setSections(newSections);
    setSelectedId(newSection.id);
    saveToHistory(newSections, globalStyles);
  };

  const moveSection = (id: string, dir: 'up' | 'down') => {
    const idx = sections.findIndex(s => s.id === id);
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === sections.length - 1)) return;
    const newSections = [...sections];
    const [removed] = newSections.splice(idx, 1);
    newSections.splice(dir === 'up' ? idx - 1 : idx + 1, 0, removed);
    setSections(newSections);
    saveToHistory(newSections, globalStyles);
  };

  const updateSection = (id: string, updates: Partial<Section>) => {
    const newSections = sections.map(s => s.id === id ? { ...s, ...updates } : s);
    setSections(newSections);
    saveToHistory(newSections, globalStyles);
  };

  // Template loading
  const loadTemplate = (key: string) => {
    const template = templates[key];
    if (!template) return;
    const newSections = template.sections.map(s => ({ ...s, id: generateId() }));
    const newGlobalStyles = { ...defaultGlobalStyles, ...template.globalStyles };
    setSections(newSections);
    setGlobalStyles(newGlobalStyles);
    setShowTemplates(false);
    saveToHistory(newSections, newGlobalStyles);
  };

  // JSON import
  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        if (data.sections && data.globalStyles) {
          setSections(data.sections);
          setGlobalStyles(data.globalStyles);
          if (data.pageTitle) setPageTitle(data.pageTitle);
          saveToHistory(data.sections, data.globalStyles);
        }
      } catch (err) { console.error('Invalid JSON'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const selectedSection = sections.find(s => s.id === selectedId);
  const deviceWidths = { desktop: '100%', tablet: '768px', mobile: '375px' };

  // Render section
  const renderSection = (section: Section) => {
    const { type, content, styles } = section;
    const props = { content, styles, isPreview: mode === 'preview', onUpdate: (newContent: any) => updateSection(section.id, { content: newContent }), globalStyles };
    const components: Record<SectionType, React.ReactNode> = {
      hero: <HeroSection {...props} />,
      features: <FeaturesSection {...props} />,
      pricing: <PricingSection {...props} />,
      testimonials: <TestimonialsSection {...props} />,
      stats: <StatsSection {...props} />,
      video: <VideoSection {...props} />,
      gallery: <GallerySection {...props} />,
      logos: <LogosSection {...props} />,
      faq: <FAQSection {...props} />,
      cta: <CTASection {...props} />,
      contact: <ContactSection {...props} />,
      footer: <FooterSection {...props} />,
      divider: <DividerSection {...props} />,
      spacer: <SpacerSection {...props} />,
      comparison: <ComparisonSection {...props} />,
      timeline: <TimelineSection {...props} />,
      countdown: <CountdownSection {...props} />,
      team: <TeamSection {...props} />,
      map: <MapSection {...props} />,
      'custom-html': <CustomHTMLSection {...props} />,
      'text-block': <TextBlockSection {...props} />,
      'image-text': <ImageTextSection {...props} />,
    };
    return components[type];
  };

  const getBackgroundStyle = (styles: SectionStyles): React.CSSProperties => {
    const base: React.CSSProperties = {
      backgroundColor: styles.backgroundColor,
      color: styles.textColor,
      padding: `${styles.padding.top}px ${styles.padding.right}px ${styles.padding.bottom}px ${styles.padding.left}px`,
      margin: `${styles.margin.top}px ${styles.margin.right}px ${styles.margin.bottom}px ${styles.margin.left}px`,
      borderWidth: styles.border.width,
      borderStyle: styles.border.style,
      borderColor: styles.border.color,
      borderRadius: styles.border.radius,
      boxShadow: styles.shadow.blur > 0 || styles.shadow.spread > 0 ? `${styles.shadow.x}px ${styles.shadow.y}px ${styles.shadow.blur}px ${styles.shadow.spread}px ${styles.shadow.color}` : 'none',
      minHeight: styles.minHeight || 'auto',
      fontFamily: styles.font.family,
    };
    if (styles.backgroundType === 'gradient') {
      base.background = `linear-gradient(${styles.gradientAngle}deg, ${styles.gradientFrom}, ${styles.gradientTo})`;
    } else if (styles.backgroundType === 'image' && styles.backgroundImage) {
      base.backgroundImage = `url(${styles.backgroundImage})`;
      base.backgroundSize = 'cover';
      base.backgroundPosition = 'center';
    }
    return base;
  };

  const categories = ['all', ...new Set(Object.values(sectionMeta).map(m => m.category))];
  const filteredSectionTypes = Object.entries(sectionMeta).filter(([_, meta]) => sectionCategory === 'all' || meta.category === sectionCategory);

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
      {/* Google Fonts */}
      <link href={`https://fonts.googleapis.com/css2?family=${globalStyles.headingFont.replace(/ /g, '+')}:wght@400;500;600;700&family=${globalStyles.bodyFont.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`} rel="stylesheet" />
      
      {/* Header */}
      <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center font-bold text-sm">LP</div>
            <span className="font-semibold hidden sm:block">Builder Pro</span>
          </div>
          <div className="h-6 w-px bg-slate-700 hidden sm:block" />
          <button onClick={() => setShowTemplates(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-800 text-sm transition-colors">
            <FolderOpen size={16} /> テンプレート
          </button>
          <button onClick={() => setShowGlobalStyles(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-800 text-sm transition-colors">
            <Droplet size={16} /> <span className="hidden sm:inline">スタイル</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1 mr-2">
            <button onClick={undo} disabled={historyIndex <= 0} className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="元に戻す"><Undo2 size={18} /></button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="やり直し"><Redo2 size={18} /></button>
          </div>

          {/* Device Toggle */}
          <div className="flex items-center bg-slate-800 rounded-lg p-1">
            {[{ d: 'desktop', I: Monitor }, { d: 'tablet', I: Tablet }, { d: 'mobile', I: Smartphone }].map(({ d, I }) => (
              <button key={d} onClick={() => setDevice(d as any)} className={`p-2 rounded transition-colors ${device === d ? 'bg-sky-600 text-white' : 'text-gray-400 hover:text-white'}`}><I size={16} /></button>
            ))}
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center bg-slate-800 rounded-lg p-1">
            <button onClick={() => setMode('edit')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors ${mode === 'edit' ? 'bg-sky-600 text-white' : 'text-gray-400 hover:text-white'}`}><Pencil size={14} /> 編集</button>
            <button onClick={() => setMode('preview')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors ${mode === 'preview' ? 'bg-sky-600 text-white' : 'text-gray-400 hover:text-white'}`}><Eye size={14} /> プレビュー</button>
          </div>

          {/* Export Menu */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-violet-500 rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-sky-500/25 transition-all">
              <Download size={16} /> エクスポート <ChevronDown size={14} />
            </button>
            <div className="absolute right-0 top-full mt-2 py-2 bg-slate-800 rounded-lg shadow-xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[160px]">
              <button onClick={() => exportToHTML(sections, globalStyles, pageTitle)} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-700 flex items-center gap-2"><Code size={14} /> HTML</button>
              <button onClick={() => exportToJSON(sections, globalStyles, pageTitle)} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-700 flex items-center gap-2"><Save size={14} /> JSON保存</button>
              <hr className="my-2 border-slate-700" />
              <button onClick={() => fileInputRef.current?.click()} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-700 flex items-center gap-2"><FileUp size={14} /> JSONインポート</button>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept=".json" onChange={importJSON} className="hidden" />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Edit Mode */}
        {mode === 'edit' && (
          <aside className="w-72 border-r border-slate-800 bg-slate-900/50 flex flex-col flex-shrink-0 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-800">
              <button onClick={() => setSidebarTab('add')} className={`flex-1 py-3 text-sm font-medium transition-colors ${sidebarTab === 'add' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-gray-500 hover:text-gray-300'}`}>セクション追加</button>
              <button onClick={() => setSidebarTab('layers')} className={`flex-1 py-3 text-sm font-medium transition-colors ${sidebarTab === 'layers' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-gray-500 hover:text-gray-300'}`}>レイヤー</button>
            </div>

            {sidebarTab === 'add' ? (
              <div className="flex-1 overflow-y-auto p-4">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setSectionCategory(cat)} className={`px-2 py-1 rounded text-xs transition-colors ${sectionCategory === cat ? 'bg-sky-600 text-white' : 'bg-slate-800 text-gray-400 hover:bg-slate-700'}`}>
                      {cat === 'all' ? 'すべて' : cat}
                    </button>
                  ))}
                </div>
                {/* Section Types */}
                <div className="grid grid-cols-2 gap-2">
                  {filteredSectionTypes.map(([type, meta]) => (
                    <button key={type} onClick={() => addSection(type as SectionType)} className="group flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-700 hover:border-sky-500 hover:bg-slate-800/50 transition-all text-center">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-sky-600 transition-colors">
                        <meta.Icon size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{meta.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4">
                {/* Page Title */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-xs mb-2 uppercase tracking-wider">ページタイトル</label>
                  <input type="text" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-sky-500 outline-none" />
                </div>
                {/* Layers */}
                <div className="space-y-2">
                  {sections.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-8">セクションがありません</p>
                  ) : (
                    sections.map((section, idx) => {
                      const meta = sectionMeta[section.type];
                      return (
                        <div key={section.id} onClick={() => { setSelectedId(section.id); setShowStyleEditor(true); }} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedId === section.id ? 'border-sky-500 bg-sky-500/10' : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'}`}>
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <meta.Icon size={16} className="text-gray-400 flex-shrink-0" />
                            <span className="text-sm truncate">{meta.label}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'up'); }} disabled={idx === 0} className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"><ChevronUp size={14} /></button>
                            <button onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'down'); }} disabled={idx === sections.length - 1} className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"><ChevronDown size={14} /></button>
                            <button onClick={(e) => { e.stopPropagation(); duplicateSection(section.id); }} className="p-1 rounded hover:bg-slate-700"><Copy size={14} /></button>
                            <button onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }} className="p-1 rounded hover:bg-red-500/20 text-red-400"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </aside>
        )}

        {/* Main Canvas */}
        <main className="flex-1 overflow-auto bg-slate-950 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_1px,_transparent_1px)] bg-[length:24px_24px]" />
          <div className="relative min-h-full flex justify-center py-8 px-4">
            <div style={{ width: deviceWidths[device], maxWidth: '100%', transition: 'width 0.3s ease' }} className="bg-white shadow-2xl shadow-black/50 rounded-lg overflow-hidden">
              {sections.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                  <Sparkles size={48} className="mb-4 opacity-50" />
                  <p className="text-lg mb-2">セクションがありません</p>
                  <p className="text-sm mb-4">テンプレートを選択するか、セクションを追加してください</p>
                  <button onClick={() => setShowTemplates(true)} className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">テンプレートを選択</button>
                </div>
              ) : (
                sections.map(section => {
                  // Responsive visibility
                  const hideClass = 
                    (device === 'mobile' && section.styles.hideOnMobile) ||
                    (device === 'tablet' && section.styles.hideOnTablet) ||
                    (device === 'desktop' && section.styles.hideOnDesktop);
                  if (hideClass && mode === 'preview') return null;

                  return (
                    <div
                      key={section.id}
                      onClick={() => mode === 'edit' && setSelectedId(section.id)}
                      className={`relative group ${mode === 'edit' ? 'cursor-pointer' : ''} ${hideClass ? 'opacity-30' : ''}`}
                      style={getBackgroundStyle(section.styles)}
                    >
                      {/* Overlay for image background */}
                      {section.styles.backgroundType === 'image' && section.styles.backgroundOverlayOpacity > 0 && (
                        <div style={{ position: 'absolute', inset: 0, backgroundColor: section.styles.backgroundOverlay, opacity: section.styles.backgroundOverlayOpacity, pointerEvents: 'none' }} />
                      )}
                      
                      {/* Selection indicator */}
                      {mode === 'edit' && selectedId === section.id && (
                        <div className="absolute inset-0 border-2 border-sky-500 pointer-events-none z-20">
                          <div className="absolute -top-3 left-4 px-2 py-0.5 bg-sky-500 text-white text-xs rounded">{sectionMeta[section.type].label}</div>
                        </div>
                      )}

                      {/* Hover toolbar */}
                      {mode === 'edit' && (
                        <div className={`absolute top-4 right-4 flex items-center gap-1 bg-slate-900/90 rounded-lg p-1 z-30 transition-opacity ${selectedId === section.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          <button onClick={(e) => { e.stopPropagation(); setSelectedId(section.id); setShowStyleEditor(true); }} className="p-2 rounded hover:bg-slate-700" title="スタイル"><Palette size={16} /></button>
                          <button onClick={(e) => { e.stopPropagation(); duplicateSection(section.id); }} className="p-2 rounded hover:bg-slate-700" title="複製"><Copy size={16} /></button>
                          <button onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }} className="p-2 rounded hover:bg-red-500/20 text-red-400" title="削除"><Trash2 size={16} /></button>
                        </div>
                      )}

                      {/* Section content */}
                      <div style={{ position: 'relative', zIndex: 10 }}>
                        {renderSection(section)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>

        {/* Style Editor Panel */}
        {showStyleEditor && selectedSection && (
          <StyleEditor
            section={selectedSection}
            onUpdate={(updates) => updateSection(selectedSection.id, updates)}
            onClose={() => setShowStyleEditor(false)}
            globalStyles={globalStyles}
          />
        )}

        {/* Global Styles Panel */}
        {showGlobalStyles && (
          <GlobalStylesEditor
            globalStyles={globalStyles}
            onChange={(styles) => { setGlobalStyles(styles); saveToHistory(sections, styles); }}
            onClose={() => setShowGlobalStyles(false)}
          />
        )}
      </div>

      {/* Template Selector Modal */}
      {showTemplates && <TemplateSelector onSelect={loadTemplate} onClose={() => setShowTemplates(false)} />}

      {/* Keyboard shortcuts */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes zoomOut { from { opacity: 0; transform: scale(1.1); } to { opacity: 1; transform: scale(1); } }
        @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3); } 50% { transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-100%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes rotateIn { from { opacity: 0; transform: rotate(-200deg); } to { opacity: 1; transform: rotate(0); } }
        @keyframes flipIn { 0% { opacity: 0; transform: perspective(400px) rotateX(90deg); } 40% { transform: perspective(400px) rotateX(-10deg); } 70% { transform: perspective(400px) rotateX(10deg); } 100% { opacity: 1; transform: perspective(400px) rotateX(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }
      `}</style>
    </div>
  );
}
