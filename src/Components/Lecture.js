import React, {useEffect, useState} from 'react'
import axios from "axios";
import Spinner from "./spinner/Spinner";

const Lecture = (props) => {

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
        //diziler doldurulduktan sonra boyut setlenir boylece ders programinda olusacak satir sayisini buluruz
        setMaxSize(Math.max(pazartesi.length, sali.length, carsamba.length, persembe.length, cuma.length));

        return () => {
            setMaxSize(0);
        }
    }, [pazartesi.length, sali.length, carsamba.length, persembe.length, cuma.length])

    useEffect(() => {
        if (week) {
            for (let i = 0; i < week.CourseCode.length; i++) {//indexlere göre dolaşıyoruz.Course code leng alarak.
                const parsedDate = week.SectionTime[i].split(" ");//tarihi parcala
                const obj = {
                    CourseCode: week.CourseCode[i],
                    CourseCredit: week.CourseCredit[i],
                    CourseName: week.CourseName[i],
                    Instructor:week.Instructor[i],
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
        //servisten ders programini cek
        axios.get("https://smartcampus3.herokuapp.com/lectures/" + props.user.email, {signal: ac.signal}).then(result => {
            setWeek(result.data[0]);//Gelen datayı week içine koy
        }).catch(() => {
            setError("Please report admin.")
        });

        return () => {
            //component unmount olurken stateler sifirlanir boylece sayfa yuklenmeden unmount edilirse axiso istegi iptal edilmis olur
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
    }, [props.user])//warningi engellemek için yzılır

    return <>
        {error ? <div className="alert alert-danger" role="alert"> {error} </div> ://Hata varsa hatayı bas
            (week && (pazartesi.length > 0 || sali.length > 0 || carsamba.length > 0 || persembe.length > 0 || cuma.length > 0)) ?//Hata yoksa herhangi bir tane günün uzunluğu sıfırdan büyükse Dersleri bas
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
                            {[...Array(maxSize)].map((value, i) => {//Max size göre satırları oluşturuyoruz.kaç tane satır varsa o kadar dönüyor.Value kullanmıyoruz.İndexe göre basıyoruz.Ama lengyi sıfırdan byükse basıyoruz.Çünkü eğer sıfır olursa pazartesi hata alırız.Uygun değilse td boş basar
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
                                    Instructor
                                </th>
                                <th>
                                    Credi
                                </th>
                            </tr>
                            </thead>
                            <tbody className="text-center">
                            {parsedWeek.map((val, i) => {//Parsedweek diye sırasıyla bir yere daha koyduk.Bunarın hepsini dönüyoruz.
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
                                        <p className="mb-0 text-muted"><span>{val.Instructor}</span></p>
                                    </td>
                                    <td>
                                        <p className="mb-0 text-muted"><span>{val.CourseCredit}</span></p>
                                    </td>
                                </tr>
                            })}
                            </tbody>
                        </table>
                    </div>
                </div> : <Spinner/>}
    </>
}

export default Lecture;