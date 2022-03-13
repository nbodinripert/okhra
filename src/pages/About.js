import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { getRoussillonMeteo } from '../services/meteo.service';

import about from '../assets/about.png';

import '../stylesheets/About.css';

export const About = () => {
    //#region states
    const [temperature, setTemperature] = useState('');
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
                    <Link to="/" className='bar-link okhra-title'>OKHRA</Link>
                </div>
                <div id='linksContainer'>
                    <span className='active-link'>About</span>
                    <Link to="/contact" className='bar-link bar-right-link ml-2'>Contact</Link>
                </div>
            </div>
            <div className='width-100 center-section bg-orange flex-row'>
                <div className='width-50 height-100 flex-col justify-content-between about-text'>
                    <p>OKHRA workshop provides a platform to initiate collective discussions about the future of the village of Roussillon, its conservation and identity. Locals will automatically take more ownership of their traditions and initiate a positive dialogue with visitors. Roussillon is a village within the ochre landscapes of the ‘Parc naturel régional du Luberon’. This website aims to gather and achieve the evolving parcourse of OKHRA’s workshop. Inspired by the traditional ochre miner’s samples, using old fee cards, folded to form an envelope in which the pigment is put. Here the same principle is used. Using the handout of the workshop, the participant becomes ochrier for a day and leaves with a testimony of his participation containing the pigment of the wall he participated in. The numbering of this envelope is creating another map/discovery of the city.</p>
                    <div className='flex-col'>
                        <span>©OKHRA</span>
                        <span>Project directed by Victoire de Brantes</span>
                        <span>2022</span>
                    </div>
                </div>
                <div className='width-50 height-100'>
                    <img className='height-100 width-100' src={about} alt='aboutImg' />
                </div>
            </div>
            <div className='width-100 footer'>
                <div className="animated-container">
                    <p><b>Next workshop:</b> Sat 14th of May at Rue du Puits, 11am - Sat 21st of May at Place Camille Mathieu, 11am RSVP at <a className='bar-link' href='mailto:info@okhra.fr' target="_blank" rel="noreferrer">info@okhra.fr</a>{renderTemperature()}</p>
                </div>
            </div>
        </div>
    )
    //#endregion
}
