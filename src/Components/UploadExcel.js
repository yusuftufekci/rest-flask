import React, {useEffect, useState} from 'react'
import axios from "axios";

const UploadExcel = () => {
    const [error, setError] = useState(undefined);
    const [success, setSuccess] = useState(undefined);
    const [progress, setProgress] = useState(undefined);
    const [file, setFile] = useState(undefined);

    const handleSubmit = (e) => {
        e.preventDefault();

        let fd = new FormData();
        fd.append('file', file, file.name);

        axios.post("https://smartcampus3.herokuapp.com/upload/file", fd, {
            onUploadProgress: progressEvent => {
                setProgress((Math.round(progressEvent.loaded / progressEvent.total) * 100) + '%')
            }
        }).then(() => {
            setSuccess("Upload Successful");
            setError(undefined);
        }).catch(() => {
            setSuccess(undefined);
            setError("Upload Error. Please report admin");
        });
    }

    useEffect(() => {
        return () => {
            setError(undefined);
            setSuccess(undefined);
            setProgress(undefined);
        };
    }, []);

    return <>
        <div className="mt-5 container">
            <div className="text-center">
                <h3>
                    Upload Excel
                </h3>
            </div>
            <div className="row justify-content-center mt-5">
                <form className="col-4 align-self-center" onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger" role="alert"> {error} </div>}
                    {success && <div className="alert alert-success" role="alert"> {success} </div>}
                    {progress && <div className="alert alert-info text-center" role="alert"> Progress {progress} </div>}
                    <div className="form-group">
                        <label htmlFor="exampleFormControlFile1">Please select excel file</label>
                        <input type="file" className="form-control-file"
                               accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                               onChange={event => {
                                   setFile(event.target.files[0])
                               }}
                               required/>
                    </div>
                    <button type="submit" className="btn-dark btn-lg btn-block">Upload</button>
                </form>
            </div>
        </div>
    </>
};

export default UploadExcel;