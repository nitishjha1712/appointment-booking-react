import React, { useCallback, useEffect, useState, useContext } from 'react';
import DatePicker from "react-datepicker";
import { format} from 'date-fns'
import 'react-datepicker/dist/react-datepicker.css';
import TimezoneSelect from 'react-timezone-select';
import axios from "axios";
import Navbar from "./Navbar";
import {TimezoneContext} from "../App";
import Loader from "./Loader";


const Bookevent = (props) => {
    const [startDate, setStartDate] = useState(new Date());
    const [selectedTimezone, setSelectedTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [duration, setDuration] = useState(30);
    const [activeSection, setActiveSection] = useState('book-slots');
    const [activeSlots, setActiveSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState();
    const [loader, setLoader] = useState(true);

    const [context, setContext] = useContext(TimezoneContext);

    const getFreeSlots = (date) => {
        setLoader(true);
        let reqParams = {
            date : format(date, 'yyyy-MM-dd'),
            timezone : selectedTimezone
        }

        axios
        .post(process.env.REACT_APP_API_PATH + '/api/appointment/free-slots', reqParams)
        .then((response) => {
          console.log('response', response);
          if(response.status === 200){
            setActiveSection('book-slots');
            setActiveSlots(response.data.data.availableSlots);
            
          }
          setLoader(false);
        });
    };

    useEffect(() => {
        getFreeSlots(startDate);
        // console.log('context', context, selectedTimezone);
        setContext(selectedTimezone);
    }, [startDate, selectedTimezone]);


    const createSlots = () => {
        setLoader(true);
        let reqParams = {
            dateTime : format(startDate, 'yyyy-MM-dd') + " " +selectedSlot,
            timezone : selectedTimezone.replace('Calcutta', 'Kolkata'),
            duration
        }

        axios
        .post(process.env.REACT_APP_API_PATH + '/api/appointment/create', reqParams)
        .then((response) => {
            getFreeSlots(startDate);
            if(response.status === 200){
                alert(`Slots Booked for date : ${startDate} time : ${selectedSlot} for ${duration} minutes`);
            }
        })
    }


    const handleDateSelect = () => {
        console.log("inside date select");
    }

    const handleSubmit = () => {
        createSlots();
    }

    const handleDurationChange = (event) => {
        console.log("onchange", event.target.value);
        setDuration(event.target.value);
    }

    const handleSlotClick = (slot) => {
        setSelectedSlot(slot);
    }

    const handleDateChange = (date) => {
        setStartDate(date);
    }

    const handleTimezoneChange = (timezone) => {
        timezone = timezone.value.replace('Calcutta', 'Kolkata');
        console.log("timezone", timezone);
        setSelectedTimezone(timezone);
    }


        return (
            <>
                {loader && (
                    <Loader />
                )}
                <Navbar />
                <section className="jumbotron text-center">
                    <div className='container-sm'>
                        <div className='row'>
                            <div className="col">
                                <div className="row justify-content-md-center form-group">
                                    <div className='col col-lg-6 pt-5'>
                                        <label>Select Date for booking </label>
                                        <DatePicker
                                        className='text-center'
                                        dateFormat="dd-MM-yyyy"
                                        selected={startDate}
                                        onSelect={handleDateSelect} //when day is clicked
                                        onChange={(date) => handleDateChange(date)} //only when value has changed
                                        inline
                                        />
                                    </div>
                                </div>
        
                                <div className="row justify-content-md-center">
                                    <div className='col col-lg-6 pt-4'>
                                        <label>Select Timezone </label>
                                        <TimezoneSelect
                                        className='text-center'
                                        value={selectedTimezone}
                                        onChange={(timezone) => handleTimezoneChange(timezone)}
                                        />
                                    </div>
                                </div>
                            </div>
                            {activeSection === 'book-slots' && (
                                <div className='col'>
                                    <section className="jumbotron text-center">
                                        <div className="container-sm">
                                            <div className="row justify-content-md-center form-group">
                                                <div className='col col-lg-6'>
                                                    <div className='col col-lg-12'>{activeSlots.length == 0 ? "No slots available for " : "Slots avilility"} for {format(startDate, 'yyyy-MM-dd')}</div>
        
                                                    {activeSlots.map((slot) => {
                                                        return <label className = {selectedSlot == slot ? "col-lg-12 btn btn-secondary" : "col-lg-12"} onClick={() => handleSlotClick(slot)}>{slot}</label>
                                                    })}

                                                    {activeSlots.length > 0 && (
                                                        <div className='col col-lg-12 pt-4'>
                                                            <label>Add appointment duration in minutes</label>
                                                            <input type="number" className='text-center' value={duration} onChange={handleDurationChange}/>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                                {/* <div className='col col-lg-3 pt-4'>
                                                    <label>Add appointment duration in minutes</label>
                                                    <input type="number" className='text-center' value={duration} onChange={handleDurationChange}/>
                                                </div> */}
                                        </div>
                                    </section>
                                </div>
                            )}
                            <div className = "row justify-content-md-center">
                                <div className='col col-lg-3 pt-4'>
                                    <button className="btn btn-primary" disabled={selectedSlot ? false : true} onClick={handleSubmit}>Book Slot</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );

    // if(activeSection === 'book-slots'){
    //     return (
            
    //     );
    // }
}

export default Bookevent;