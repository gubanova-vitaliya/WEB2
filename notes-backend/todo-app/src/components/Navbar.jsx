import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export const Navbar = () => {
  return (
    <nav className='nav'>
      <div className='nav__wrapper'>
        <div className='nav__links'>
          <NavLink to='/' className='nav__link'>Главная</NavLink>
          <NavLink to='/shopping' className='nav__link'>Корзина</NavLink>
          <NavLink to='/guest' className='nav__link'>Гостевой режим</NavLink>
          <NavLink to='/guest/tasks' className='nav__link'>Задачи</NavLink>
          <NavLink to='/guest/gallery' className='nav__link'>Галерея</NavLink>
        </div>
        <div className='nav__cart'>
          <NavLink to='/' className='nav__link nav__link--cart'>Управление</NavLink>
        </div>
        <div className='nav__mobile-wrapper'
             onClick={(event) => event.currentTarget.classList.toggle('active')}
        >
          <div className='nav__mobile-target' />
          <div className='nav__mobile-menu' onClick={(event) => event.stopPropagation()}>
            <NavLink to='/' className='nav__link'>Главная</NavLink>
            <NavLink to='/shopping' className='nav__link'>Корзина</NavLink>
            <NavLink to='/guest' className='nav__link'>Гостевой режим</NavLink>
            <NavLink to='/guest/tasks' className='nav__link'>Задачи</NavLink>
            <NavLink to='/guest/gallery' className='nav__link'>Галерея</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};
