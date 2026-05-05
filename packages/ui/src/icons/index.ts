import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BiCategoryAlt, BiUser } from 'react-icons/bi';
import { BsShieldExclamation, BsTags } from 'react-icons/bs';
import { FaInfoCircle } from 'react-icons/fa';
import {
  FiActivity,
  FiAlertCircle,
  FiAlertTriangle,
  FiBell,
  FiBellOff,
  FiClock,
  FiCopy,
  FiCreditCard,
  FiDownload,
  FiEye,
  FiEyeOff,
  FiHeart,
  FiHelpCircle,
  FiImage,
  FiInfo,
  FiLock,
  FiLogOut,
  FiMail,
  FiMinus,
  FiRefreshCw,
  FiSearch,
  FiSend,
  FiSettings,
  FiShare2,
  FiShield,
  FiUpload,
  FiUsers,
  FiZap,
} from 'react-icons/fi';
import { GiDiamondTrophy, GiLifeBuoy } from 'react-icons/gi';
import { GoHomeFill } from 'react-icons/go';
import { GrFavorite } from 'react-icons/gr';
import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineArrowDownLeft,
  HiOutlineArrowsUpDown,
  HiOutlineArrowUpRight,
} from 'react-icons/hi2';
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosDownload,
  IoLogoApple,
} from 'react-icons/io';
import {
  IoChevronBackOutline,
  IoChevronDownOutline,
  IoChevronForwardOutline,
  IoChevronUpOutline,
  IoHeart,
  IoPlaySharp,
  IoSquareSharp,
} from 'react-icons/io5';
import { LuHeartHandshake, LuShieldCheck } from 'react-icons/lu';
import {
  MdArrowForward,
  MdChatBubble,
  MdCheck,
  MdCheckroom,
  MdClose,
  MdDarkMode,
  MdDescription,
  MdDirectionsWalk,
  MdExplore,
  MdFindInPage,
  MdForum,
  MdHistory,
  MdInventory,
  MdLayers,
  MdMemory,
  MdMouse,
  MdNavigation,
  MdOpenInNew,
  MdOutlineAdd,
  MdOutlineAutoAwesome,
  MdOutlineCalendarMonth,
  MdOutlineCardGiftcard,
  MdOutlineCheckCircle,
  MdOutlineDeleteOutline,
  MdOutlineErrorOutline,
  MdOutlineInventory2,
  MdOutlineLocalShipping,
  MdOutlineModeEditOutline,
  MdOutlinePhone,
  MdOutlinePhotoCamera,
  MdOutlineSave,
  MdScale,
  MdShoppingCart,
  MdStar,
  MdStars,
  MdStorage,
  MdStore,
  MdStraighten,
  MdTrendingDown,
  MdTrendingUp,
  MdVerifiedUser,
  MdWallet,
  MdWarning,
  MdWatch,
  MdWbSunny,
} from 'react-icons/md';
import { PiArrowsLeftRightLight, PiBriefcaseFill, PiMapPin, PiShoppingBag } from 'react-icons/pi';
import {
  RiArrowUpDownLine,
  RiMenuSearchLine,
  RiShieldStarFill,
  RiVerifiedBadgeFill,
} from 'react-icons/ri';
import { RxHamburgerMenu, RxStar, RxStarFilled } from 'react-icons/rx';
import { SiFacebook, SiInstagram, SiX, SiYoutube } from 'react-icons/si';
import { TbHeartMinus, TbHeartPlus, TbJacket, TbShirt, TbShoe, TbHanger } from 'react-icons/tb';
import { TfiCrown } from 'react-icons/tfi';
import { TiThMenuOutline } from 'react-icons/ti';

// NAVIGATION & ARROWS
export const ArrowLeftIcon = IoChevronBackOutline;
export const ArrowRightIcon = IoChevronForwardOutline;
export const ArrowUpIcon = IoChevronUpOutline;
export const ArrowDownIcon = IoChevronDownOutline;
export const ArrowUpRightIcon = HiOutlineArrowUpRight;
export const ArrowDownLeftIcon = HiOutlineArrowDownLeft;
export const ArrowUpDownIcon = RiArrowUpDownLine;
export const ArrowLeftRightIcon = PiArrowsLeftRightLight;
export const ChevronLeftIcon = IoChevronBackOutline;
export const ChevronRightIcon = IoChevronForwardOutline;
export const ChevronUpIcon = IoChevronUpOutline;
export const ChevronDownIcon = IoChevronDownOutline;

// SHOPPING & COMMERCE
export const ShoppingBagIcon = PiShoppingBag;
export const ShoppingCartIcon = MdShoppingCart;
export const PackageIcon = MdOutlineInventory2;
export const TruckIcon = MdOutlineLocalShipping;
export const GiftIcon = MdOutlineCardGiftcard;
export const TagIcon = BsTags;

// SOCIAL & FAVORITES
export const HeartIcon = FiHeart;
export const HeartFilledIcon = IoHeart;
export const HeartPlusIcon = TbHeartPlus;
export const HeartMinusIcon = TbHeartMinus;
export const StarIcon = RxStar;
export const FilledStarIcon = RxStarFilled;
export const StarFilledIcon = MdStar;
export const StarsIcon = MdStars;
export const WishlistIcon = GrFavorite;

// SOCIAL MEDIA
export const InstagramIcon = SiInstagram;
export const TwitterIcon = SiX;
export const YoutubeIcon = SiYoutube;
export const FacebookIcon = SiFacebook;
export { SiWhatsapp as WhatsAppIcon } from 'react-icons/si';

// USER & ACCOUNT
export const UserIcon = BiUser;
export const UsersIcon = FiUsers;
export const UserCheckIcon = MdVerifiedUser;

// NOTIFICATIONS & ALERTS
export const BellIcon = FiBell;
export const BellOffIcon = FiBellOff;
export const AlertIcon = MdOutlineErrorOutline;
export const AlertCircleIcon = FiAlertCircle;
export const AlertTriangleIcon = FiAlertTriangle;
export const InfoIcon = FiInfo;
export const InfoCircleIcon = FaInfoCircle;
export const HelpCircleIcon = FiHelpCircle;
export const WarningIcon = MdWarning;

// ACTIONS & CONTROLS
export const PlayIcon = IoPlaySharp;
export const PauseIcon = IoPlaySharp;
export const StopIcon = IoSquareSharp;
export const CheckIcon = MdCheck;
export const CheckCircleIcon = MdOutlineCheckCircle;
export const CloseIcon = MdClose;
export const PlusIcon = MdOutlineAdd;
export const MinusIcon = FiMinus;
export const EditIcon = MdOutlineModeEditOutline;
export const DeleteIcon = MdOutlineDeleteOutline;
export const TrashIcon = MdOutlineDeleteOutline;
export const SaveIcon = MdOutlineSave;
export const CopyIcon = FiCopy;
export const ShareIcon = FiShare2;
export const SendIcon = FiSend;
export const SearchIcon = FiSearch;
export const FilterIcon = HiOutlineAdjustmentsHorizontal;
export const SortIcon = HiOutlineArrowsUpDown;
export const SlidersIcon = HiOutlineAdjustmentsHorizontal;

// MEDIA
export const CameraIcon = MdOutlinePhotoCamera;
export const ImageIcon = FiImage;

// LOCATION & MAPS
export const MapPinIcon = PiMapPin;
export const NavigationIcon = MdNavigation;
export const GlobeIcon = MdExplore;

// TIME & CALENDAR
export const ClockIcon = FiClock;
export const CalendarIcon = MdOutlineCalendarMonth;
export const HistoryIcon = MdHistory;

// PAYMENT & FINANCE
export const CreditCardIcon = FiCreditCard;
export const WalletIcon = MdWallet;
export const BanknoteIcon = FiCreditCard;

// SECURITY
export const ShieldIcon = FiShield;
export const ShieldCheckIcon = LuShieldCheck;
export const ShieldAlertIcon = BsShieldExclamation;
export const LockIcon = FiLock;

// COMMUNICATION
export const MailIcon = FiMail;
export const PhoneIcon = MdOutlinePhone;
export const MessageIcon = MdChatBubble;
export const MessageSquareIcon = MdForum;

// UI
export const MenuIcon = TiThMenuOutline;
export const HamburgerMenuIcon = RxHamburgerMenu;
export const HomeIcon = GoHomeFill;
export const SettingsIcon = FiSettings;
export const Settings2Icon = FiSettings;
export const LogOutIcon = FiLogOut;

// STATUS & ACTIVITY
export const LoaderIcon = AiOutlineLoading3Quarters;
export const ActivityIcon = FiActivity;
export const RefreshCcwIcon = FiRefreshCw;

// SPECIAL
export const ZapIcon = FiZap;
export const CrownIcon = TfiCrown;
export const SparklesIcon = MdOutlineAutoAwesome;
export const TrophyIcon = GiDiamondTrophy;
export const StarBadgeIcon = RiShieldStarFill;
export const VerifiedIcon = RiVerifiedBadgeFill;
export const VerifiedUserIcon = MdVerifiedUser;

// DOCUMENTS & FILES
export const FileTextIcon = MdDescription;
export const FileCheckIcon = MdOutlineCheckCircle;
export const GavelIcon = MdDescription;

// TOOLS
export const ExternalLinkIcon = MdOpenInNew;
export const RulerIcon = MdStraighten;
export const ScaleIcon = MdScale;
export const BoxIcon = MdInventory;
export const LayersIcon = MdLayers;
export const CpuIcon = MdMemory;
export const DatabaseIcon = MdStorage;
export const FileSearchIcon = MdFindInPage;
export const SearchListIcon = RiMenuSearchLine;
export const CategoryIcon = BiCategoryAlt;

// CLOTHING
export const ShirtIcon = MdCheckroom;
export const FootprintsIcon = MdDirectionsWalk;
export const WatchIcon = MdWatch;
export const SmartphoneIcon = MdOutlinePhone;
export const JacketCategoryIcon = TbJacket;
export const ShirtCategoryIcon = TbShirt;
export const ShoeCategoryIcon = TbShoe;
export const HangerCategoryIcon = TbHanger;

// BUSINESS
export const StoreIcon = MdStore;
export const HandshakeIcon = LuHeartHandshake;
export const LifeBuoyIcon = GiLifeBuoy;

// MISC
export const MousePointerIcon = MdMouse;
export const MoveRightIcon = MdArrowForward;
export const EyeIcon = FiEye;
export const EyeOffIcon = FiEyeOff;
export const DownloadIcon = FiDownload;
export const UploadIcon = FiUpload;
export const TrendingUpIcon = MdTrendingUp;
export const TrendingDownIcon = MdTrendingDown;
export const TicketPercentIcon = MdOutlineCardGiftcard;

// THEME
export const MoonIcon = MdDarkMode;
export const SunIcon = MdWbSunny;

// BRAND
export const AppleLogoIcon = IoLogoApple;
export const DownloadIconIOS = IoIosDownload;
export const ArrowDownIconIOS = IoIosArrowDown;
export const ArrowBackIconIOS = IoIosArrowBack;
export const ArrowForwardIconIOS = IoIosArrowForward;

export const BriefcaseIcon = PiBriefcaseFill;

export type IconComponent = React.ComponentType<{ size?: number; className?: string }>;
