import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { houses } from '../models/house.model';
import { getRoussillonMeteo } from '../services/meteo.service';

import cross from '../assets/cross.png';
import leftArrow from '../assets/left_arrow.png';
import rightArrow from '../assets/right_arrow.png';

import '../stylesheets/Home.css';

export const Home = () => {
    //#region states
    const [bg, setBg] = useState(require('../assets/map.jpg'));
    const [temperature, setTemperature] = useState('');
    const [currentHouse, setCurrentHouse] = useState(null);
    const [currentWorkshopIndex, setCurrentWorkshopIndex] = useState(-1);
    //#endregion

    //#region useEffect
    useEffect(() => {
        getRoussillonMeteo().then(temp => {
            setTemperature(temp);
        });

        // on actualise la météo toutes les heures
        const interval = setInterval(() => {
            getRoussillonMeteo().then(temp => {
                setTemperature(temp);
            });
        }, 3600000);

        return () => clearInterval(interval);
    }, [])
    //#endregion

    //#region private methods
    const getCurrentWorkshop = () => {
        return currentHouse.workshops[currentWorkshopIndex];
    }

    const reset = () => {
        setBg(require('../assets/map.jpg'));
        setCurrentWorkshopIndex(-1);
        setCurrentHouse(null);
    }
    //#endregion

    //#region event methods
    const handleTitleClick = () => {
        reset();
    }

    const handleBtnClick = () => {
        setCurrentWorkshopIndex(0);
    }

    const handleBtnMouseEnter = (event) => {
        if (event && event.target && event.target.id) {
            const houseId = event.target.id;
            const crtHouse = houses.find(house => house.id === houseId);
            if (crtHouse) {
                setCurrentHouse(crtHouse);
                setBg(crtHouse.mapImg);
            }
        }
    }

    const handleBtnMouseLeave = () => {
        setCurrentHouse(null);
        setBg(require('../assets/map.jpg'));
    }

    const handleCrossClick = () => {
        reset();
    }

    const handleLeftArrowClick = () => {
        setCurrentWorkshopIndex(currentWorkshopIndex - 1);
    }

    const handleRightArrowClick = () => {
        setCurrentWorkshopIndex(currentWorkshopIndex + 1);
    }
    //#endregion

    //#region render
    const renderTemperature = () => {
        if (!temperature) return '';
        return (
            <span> - <b>Daily weather:</b> {temperature}°C</span>
        )
    }

    return (
        <div className='height-100'>
            <div className='width-100' id='bar'>
                <div id='okhraTitleContainer'>
                    <span className='okhra-title' onClick={handleTitleClick}>OKHRA</span>
                </div>
                {currentHouse && <div className='flex-row align-items-end' >
                    <span>{currentHouse.address} - <i><h3 className='bar-house-info-id'>{currentHouse.workshops[currentWorkshopIndex === -1 ? 0 : currentWorkshopIndex].pigment}</h3></i> - <i><b>Date of the workshop: </b>{currentHouse.workshops[currentWorkshopIndex === -1 ? 0 : currentWorkshopIndex].date}</i></span>
                </div>}
                <div id='linksContainer'>
                    <Link to="/about" className='bar-link bar-right-link'>About</Link>
                    <a className='bar-link bar-right-link ml-2' href='mailto:info@okhra.fr' target="_blank" rel="noreferrer">Contact</a>
                </div>
            </div>
            {
                (currentWorkshopIndex === -1) && (
                    <div className='width-100 center-section relative'>
                        <img src={bg} alt='okhramap' className='width-100 height-100' />
                        {houses.map((house) =>
                            <button
                                key={house.id}
                                id={house.id}
                                onClick={handleBtnClick}
                                onMouseEnter={handleBtnMouseEnter}
                                onMouseLeave={handleBtnMouseLeave}
                                className='transparent-button'
                                style={{ position: 'absolute', left: house.css.left, top: house.css.top, width: house.css.width, height: house.css.height }}></button>
                        )}
                    </div>
                )
            }
            {
                (currentWorkshopIndex !== -1) && (
                    <div className='width-100 center-section flex-row'>
                        <div className='width-60 height-100'>
                            <img src={getCurrentWorkshop().image} alt={`workshop + ${getCurrentWorkshop().date}`} className='width-100 height-100' />
                        </div>
                        <div className='width-40 height-100 gray'>
                            <div className='width-100 height-100'>
                                <div className='flex-row width-100 justify-content-end cross-container'>
                                    <img src={cross} alt='cross' className='cross' onClick={handleCrossClick} />
                                </div>
                                <div className='flex-row width-100 justify-content-between arrows-container'>
                                    <img src={leftArrow} alt='leftArrow' id='leftArrow' className={(currentWorkshopIndex !== 0) ? 'arrow' : 'arrow hidden'} onClick={handleLeftArrowClick} />
                                    <img src={rightArrow} alt='rightArrow' className={(currentWorkshopIndex !== currentHouse.workshops.length - 1) ? 'arrow' : 'hidden arrow'} onClick={handleRightArrowClick} />
                                </div>
                                <div className='width-100 workshop-address-container flex-row justify-content-between'>
                                    <span>{currentHouse.address}</span>
                                    <span><i>{currentHouse.coordinates}</i></span>
                                </div>
                                <div className='width-100 workshop-date-container flex-row justify-content-between'>
                                    <span><i><b>Date of the workshop: </b>{getCurrentWorkshop().date}</i></span>
                                    <span><i><b>Participants: </b>{getCurrentWorkshop().participants}</i></span>
                                </div>
                                <div className='flex-row width-100'>
                                    <div className='flex-row align-items-center workshop-pigment-container' style={{ height: `${(getCurrentWorkshop().participants * 35)}px` }}>
                                        <span><b>Pigment in use:</b> {getCurrentWorkshop().pigment}</span>
                                    </div>
                                    <div className='workshop-duration-container flex-col'>
                                        {getCurrentWorkshop().durations.map((duration, index) =>
                                            <span key={currentHouse.id + '_' + getCurrentWorkshop().pigment + '_' + duration + '_' + index} className='duration-span'><i><b>Duration: </b>{duration}</i></span>
                                        )}
                                    </div>
                                    <div className='workshop-colors-container'>
                                        {currentHouse.workshops[currentWorkshopIndex].colors.map((color, index) =>
                                            <div key={currentHouse.id + '_' + getCurrentWorkshop().pigment + '_' + color + '_' + index} className='color-container' style={{ backgroundColor: color }}></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            <div className='width-100 footer'>
                <div className="animated-container">
                    <p><b>Next workshop:</b> Sat 14th of May at Rue du Puits, 11am - Sat 21st of May at Place Camille Mathieu, 11am RSVP at <a className='bar-link' href='mailto:info@okhra.fr' target="_blank" rel="noreferrer">info@okhra.fr</a>{renderTemperature()}</p>
                </div>
            </div>
        </div >
    )
    //#endregion
}
