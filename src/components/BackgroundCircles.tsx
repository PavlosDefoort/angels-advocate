import React from "react";

const BackgroundCircles = () => {
    const createSparkles = (count: number, color: string) => {
        return Array.from({ length: count }).map((_, index) => (
            <span
                key={index}
                className={`absolute sparkle ${color}`}
                style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${3 + Math.random() * 40}s`,
                    animationDelay: `${Math.random() * 20}s`,
                }}
            ></span>
        ));
    };

    return (
        <div className="w-full h-full absolute overflow-hidden">
            {/* White sparkles for black section */}
            <div className="absolute top-0 left-0 w-1/2 h-full bg-transparent">
                {createSparkles(30, "white-sparkle")}
            </div>

            {/* Black circles for white section */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-transparent">
                {createSparkles(30, "black-circle")}
            </div>
        </div>
    );
};

export default BackgroundCircles;