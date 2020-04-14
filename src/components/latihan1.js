import React from 'react'
class Home extends React.Component{
    render(){
        return(
            <div>
                <h1>SOAL 1</h1>
                <div className='row'>
                    <div className='col-md-4 mb-4'>
                        <select className='form-control'>
                            <option>Filter By Pekerjaan</option>
                        </select>
                    </div>
                </div>
                <table className='table mb-4'>
                    <thead>
                        <tr>
                            <td>Nama</td>
                            <td>Usia</td>
                            <td>Pekerjaan</td>
                            <td>Act</td>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
                <div className='row'>
                    <div className='col-md-3'> <input type='text' className='form-control' placeholder='Nama' /> </div>
                    <div className='col-md-3'> <input type='text' className='form-control' placeholder='Usia' /> </div>
                    <div className='col-md-3'> <input type='text' className='form-control' placeholder='Pekerjaan' /> </div>
                    <div className='col-md-3'> <input type='button' className='form-control btn-info' value='add Data' /> </div>
                </div>
            </div>
        )
    }
}

export default Home