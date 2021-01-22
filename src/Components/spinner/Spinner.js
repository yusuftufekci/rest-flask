import React from 'react';
import css from './Spinner.module.css';

const Spinner = (props) => {
    return <>
        <div className="d-flex justify-content-center">
            <div className={`spinner-border text-primary mt-5 ${css.mySpinner}`} role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    </>
};

export default Spinner;