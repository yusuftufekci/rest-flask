import React, {useEffect, useState} from 'react'
import axios from "axios";
import Spinner from "./spinner/Spinner";

const LectureTeacher = (props) => {

    const [week, setWeek] = useState(undefined);
    const [parsedWeek, setParsedWeek] = useState([]);
    const [pazartesi, setPazartesi] = useState([]);
    const [sali, setSali] = useState([]);
    const [carsamba, setCarsamba] = useState([]);
    const [persembe, setPersembe] = useState([]);
    const [cuma, setCuma] = useState([]);
    const [maxSize, setMaxSize] = useState(0);
    const [error, setError] = useState(undefined);

    useEffect(() => {
        setMaxSize(Math.max(pazartesi.length, sali.length, carsamba.length, persembe.length, cuma.length));

        return () => {
            setMaxSize(0);
        }
    }, [pazartesi.length, sali.length, carsamba.length, persembe.length, cuma.length])

    useEffect(() => {
        if (week) {
            for (let i = 0; i < week.CourseCode.length; i++) {
                const parsedDate = week.SectionTime[i].split(" ");
                const obj = {
                    CourseCode: week.CourseCode[i],
                    CourseCredit: week.CourseCredit[i],
                    CourseName: week.CourseName[i],
                    day: parsedDate[0],
                    time: parsedDate[1],
                    section: week.section[i]
                };
                if (parsedDate[0] === "Pazartesi") {
                    setPazartesi(current => [...current, obj]);
                } else if (parsedDate[0] === "Salı") {
                    setSali(current => [...current, obj]);
                } else if (parsedDate[0] === "Çarşamba") {
                    setCarsamba(current => [...current, obj]);
                } else if (parsedDate[0] === "Perşembe") {
                    setPersembe(current => [...current, obj]);
                } else if (parsedDate[0] === "Cuma") {
                    setCuma(current => [...current, obj]);
                }
                setParsedWeek(current => [...current, obj]);
            }
        }
    }, [week]);

    useEffect(() => {
        const ac = new AbortController();

        axios.get("https://smartcampus3.herokuapp.com/instructor/" + props.user.email, {signal:ac.signal}).then(result => {
            setWeek(result.data[0]);
        }).catch(() => {
            setError("Please report admin.")
        });

        return () => {
            ac.abort();
            setPazartesi([]);
            setSali([]);
            setCarsamba([]);
            setPersembe([]);
            setCuma([]);
            setParsedWeek([]);
            setWeek(undefined);
            setError(undefined);
        }
    }, [props.user])

    return <>
        {error ? <div className="alert alert-danger" role="alert"> {error} </div> :
            (week && (pazartesi.length > 0 || sali.length > 0 || carsamba.length > 0 || persembe.length > 0 || cuma.length > 0)) ?
                <div className="container">
                    <div className="table-responsive mt-5 mb-5">
                        <table className="table table-bordered table-hover table-striped">
                            <thead className="thead-dark text-center">
                            <tr>
                                <th colSpan="5" className="p-4">
                                    {week.department}
                                </th>
                            </tr>
                            <tr>
                                <th>
                                    Monday
                                </th>
                                <th>
                                    Tuesday
                                </th>
                                <th>
                                    Wednesday
                                </th>
                                <th>
                                    Thursday
                                </th>
                                <th>
                                    Friday
                                </th>
                            </tr>
                            </thead>
                            <tbody className="text-center">
                            {[...Array(maxSize)].map((value, i) => {
                                return <tr key={i}>
                                    {pazartesi.length > i ? <td key={pazartesi[i].CourseCode + pazartesi[i].time}>
                                        <p className="mb-0"><strong>{pazartesi[i].CourseCode}</strong></p>
                                        <p className="mb-0 text-muted"><span>{pazartesi[i].CourseName}</span></p>
                                        <p className="mb-0 text-muted"><span>{pazartesi[i].time}</span></p>
                                    </td> : <td/>}
                                    {sali.length > i ? <td key={sali[i].CourseCode + sali[i].time}>
                                        <p className="mb-0"><strong>{sali[i].CourseCode}</strong></p>
                                        <p className="mb-0 text-muted"><span>{sali[i].CourseName}</span></p>
                                        <p className="mb-0 text-muted"><span>{sali[i].time}</span></p>
                                    </td> : <td/>}
                                    {carsamba.length > i ? <td key={carsamba[i].CourseCode + carsamba[i].time}>
                                        <p className="mb-0"><strong>{carsamba[i].CourseCode}</strong></p>
                                        <p className="mb-0 text-muted"><span>{carsamba[i].CourseName}</span></p>
                                        <p className="mb-0 text-muted"><span>{carsamba[i].time}</span></p>
                                    </td> : <td/>}
                                    {persembe.length > i ? <td key={persembe[i].CourseCode + persembe[i].time}>
                                        <p className="mb-0"><strong>{persembe[i].CourseCode}</strong></p>
                                        <p className="mb-0 text-muted"><span>{persembe[i].CourseName}</span></p>
                                        <p className="mb-0 text-muted"><span>{persembe[i].time}</span></p>
                                    </td> : <td/>}
                                    {cuma.length > i ? <td key={cuma[i].CourseCode + cuma[i].time}>
                                        <p className="mb-0"><strong>{cuma[i].CourseCode}</strong></p>
                                        <p className="mb-0 text-muted"><span>{cuma[i].CourseName}</span></p>
                                        <p className="mb-0 text-muted"><span>{cuma[i].time}</span></p>
                                    </td> : <td/>}
                                </tr>
                            })}
                            </tbody>
                        </table>
                    </div>

                    <div className="table-responsive mt-5 mb-5">
                        <table className="table table-bordered table-hover table-striped">
                            <thead className="thead-dark text-center">
                            <tr>
                                <th colSpan="5" className="p-4">
                                    {week.department}
                                </th>
                            </tr>
                            <tr>
                                <th>
                                    Course Code
                                </th>
                                <th>
                                    Course Name
                                </th>
                                <th>
                                    Section
                                </th>
                                <th>
                                    Credi
                                </th>
                            </tr>
                            </thead>
                            <tbody className="text-center">
                            {parsedWeek.map((val, i) => {
                                return <tr key={"p" + i}>
                                    <td>
                                        <p className="mb-0 text-muted"><span>{val.CourseCode}</span></p>
                                    </td>
                                    <td>
                                        <p className="mb-0 text-muted"><span>{val.CourseName}</span></p>
                                    </td>
                                    <td>
                                        <p className="mb-0 text-muted"><span
                                            className="badge badge-success">{val.section}</span></p>
                                    </td>
                                    <td>
                                        <p className="mb-0 text-muted"><span>{val.CourseCredit}</span></p>
                                    </td>
                                </tr>
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
                : <Spinner/>}
    </>
}

export default LectureTeacher;