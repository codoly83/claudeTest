import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { SwiperProps } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper';
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/a11y';

// 슬라이드·캐러셀 (docs/components/Slider.md, AGENTS.md 5.6) — swiper/react
// 옵션(navigation·pagination·autoplay·loop·breakpoints 등)은 디자인·요구사항에 있는 것만 페이지에서 options로 넘깁니다.
// autoplay를 쓰면 정지/재생 버튼을 함께 보여 줍니다 (접근성). 스타일 재정의는 common.css 06 섹션.
interface SliderProps<T extends { id: string }> {
    items: T[];
    renderItem: (item: T) => ReactNode;
    label: string;
    options?: Omit<SwiperProps, 'children' | 'modules'>;
}

const MODULES = [A11y, Autoplay, Keyboard, Navigation, Pagination];

const Slider = <T extends { id: string }>({ items, renderItem, label, options = {} }: SliderProps<T>) => {
    const swiperRef = useRef<SwiperInstance | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const hasAutoplay = Boolean(options.autoplay);

    const handleTogglePlay = () => {
        const autoplay = swiperRef.current?.autoplay;
        if (!autoplay) return;
        if (isPlaying) autoplay.stop();
        else autoplay.start();
        setIsPlaying((prev) => !prev);
    };

    return (
        <div className="slider" role="region" aria-roledescription="carousel" aria-label={label}>
            {hasAutoplay && (
                <button type="button" className="sliderPlay" aria-label={isPlaying ? '자동 재생 정지' : '자동 재생 시작'} onClick={handleTogglePlay}>
                    <span className={`iconMask ${isPlaying ? 'iconPause' : 'iconPlay'}`} aria-hidden="true" />
                </button>
            )}
            <Swiper
                modules={MODULES}
                slidesPerView={1}
                spaceBetween={16}
                a11y={{ prevSlideMessage: '이전 슬라이드', nextSlideMessage: '다음 슬라이드', paginationBulletMessage: '{{index}}번 슬라이드로 이동', slideLabelMessage: '{{index}} / {{slidesLength}}' }}
                {...options}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
            >
                {items.map((item) => (
                    <SwiperSlide key={item.id}>{renderItem(item)}</SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Slider;
