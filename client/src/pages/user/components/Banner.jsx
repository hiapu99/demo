import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
        partialVisibilityGutter: 40 // Amount of px visible
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1,
        partialVisibilityGutter: 30 // Amount of px visible
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        partialVisibilityGutter: 30 // Amount of px visible
    }
};

const slides = [
    {
        image: 'https://www.shutterstock.com/shutterstock/photos/1663164736/display_1500/stock-vector-super-sale-header-or-banner-design-with-d-smartphone-smart-watch-voice-assistant-air-purifier-1663164736.jpg',

    },
    {
        image: 'https://www.shutterstock.com/shutterstock/photos/1663164736/display_1500/stock-vector-super-sale-header-or-banner-design-with-d-smartphone-smart-watch-voice-assistant-air-purifier-1663164736.jpg',

    },
    {
        image: 'https://www.shutterstock.com/shutterstock/photos/1663164736/display_1500/stock-vector-super-sale-header-or-banner-design-with-d-smartphone-smart-watch-voice-assistant-air-purifier-1663164736.jpg',

    },
    {
        image: 'https://www.shutterstock.com/shutterstock/photos/1663164736/display_1500/stock-vector-super-sale-header-or-banner-design-with-d-smartphone-smart-watch-voice-assistant-air-purifier-1663164736.jpg',

    },
    {
        image: 'https://www.shutterstock.com/shutterstock/photos/1663164736/display_1500/stock-vector-super-sale-header-or-banner-design-with-d-smartphone-smart-watch-voice-assistant-air-purifier-1663164736.jpg',

    },

];

const Slider = () => {
    return (
        <div className="relative">
            <Carousel
                swipeable={true}
                draggable={true}
                showDots={true}
                responsive={responsive}
                ssr={true} // Server-side rendering
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={5000}
                keyBoardControl={true}
                customTransition="all .5"
                transitionDuration={500}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px"
            >
                {slides.map((slide, index) => (
                    <div key={index} className="relative">
                        <img
                            src={slide.image}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-96 object-cover"
                        />
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default Slider;
