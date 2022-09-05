import React, { useState } from 'react';
import { useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import DatePicker from "react-datepicker";
import { format} from 'date-fns'
import 'react-datepicker/dist/react-datepicker.css';
import {TimezoneContext} from "../App";

const Showevent = () => {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [events, setEvents] = useState([]);
    const [timezone, setTimezone] = useContext(TimezoneContext);

    useEffect(() => {
        setTimezone(timezone);
    }, []);

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    }

    const handleDateSelect = () => {
        console.log("inside select");
    }

    const handleSubmit = () => {
        let reqParams = {
            startDate : format(startDate, 'yyyy-MM-dd'),
            endDate : format(endDate, 'yyyy-MM-dd'),
            timezone : timezone ? timezone : Intl.DateTimeFormat().resolvedOptions().timeZone.replace('Calcutta', 'Kolkata'),
        }

        axios
        .post(process.env.REACT_APP_API_PATH + '/api/appointment/get', reqParams)
        .then((response) => {
            if(response.status === 200){
                setEvents(response.data.data.eventData);
            }
        })
    }

    return (
        <>
            <Navbar />
            <section className="jumbotron text-center">
                <div className='container-sm'>
                    <div className='row'>
                        <div className="col">
                            <div className="row justify-content-md-center form-group">
                                <div className='col col-lg-8 pt-5'>
                                    <label>Select start and end date to fetch bookings</label>
                                    <DatePicker
                                    className='text-center'
                                    dateFormat="dd-MM-yyyy"
                                    selected={startDate}
                                    onSelect={handleDateSelect} //when day is clicked
                                    onChange={(dates) => handleDateChange(dates)} //only when value has changed
                                    startDate={startDate}
                                    endDate={endDate}
                                    selectsRange
                                    inline
                                    />
                                </div>
                            </div>
                        </div>

                        
                        <div className='col'>
                            {startDate && endDate && (
                                <section className="jumbotron text-center pt-5">
                                    <div className="container-sm">
                                        <div className="row justify-content-md-center form-group">
                                            <div className='col col-lg-12'>
                                                <div className='col col-lg-12'>
                                                    Events from date {format(startDate, 'yyyy-MM-dd')} to {format(endDate, 'yyyy-MM-dd')} Timezone {timezone ? timezone : Intl.DateTimeFormat().resolvedOptions().timeZone.replace('Calcutta', 'Kolkata')}
                                                </div>
                                                <div className='col col-lg-12'>
                                                    <div className='col col-lg-12'>
                                                        <table className="table table-bordered">
                                                            <thead className='thead-light'>
                                                                <tr>
                                                                    <th scope="col">Date</th>
                                                                    <th scope="col">Duration</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {events.map((event) => {
                                                                    return (
                                                                        <tr>
                                                                            <td>{event.eventDate}</td>
                                                                            <td>{event.eventDuration} minutes</td>
                                                                        </tr>
                                                                    )
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                    <div className = "row justify-content-md-center">
                        <div className='col col-lg-3 pt-4'>
                            <button className="btn btn-primary" disabled={startDate && endDate ? false : true} onClick={handleSubmit}>Fetch Slots</button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Showevent;