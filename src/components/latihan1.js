import React, { createRef } from 'react'
import {MdDeleteForever} from 'react-icons/md'
import {FiEdit} from 'react-icons/fi'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Axios from 'axios'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

const MySwal = withReactContent(Swal)
class Home extends React.Component{
    state={
        isOpen:false,
        data:[],
        dataFilter:[],
        dataEdit:[],
        inputNama:createRef(),
        inputUsia:createRef(),
        inputPekerjaan:createRef(),
        inputNamaEdit:createRef(),
        inputUsiaEdit:createRef(),
        inputPekerjaanEdit:createRef(),
        filterCategory:createRef(),
        category:null,
        stop:false
    }
    componentDidMount(){
        Axios.get('http://localhost:4000/data')
        .then((res)=>{
            this.state.inputNama.current.focus()
            this.setState({data:res.data})
        }).catch((err)=>{
            console.log(err)
        })
    }

    addPostClick=()=>{
        this.setState({category:null})
        let nama=this.state.inputNama.current.value
        let usia=this.state.inputUsia.current.value
        let pekerjaan=this.state.inputPekerjaan.current.value
        console.log(nama,usia,pekerjaan)
        Axios.post(`http://localhost:4000/data`,{
            nama,
            usia,
            pekerjaan
        }).then(()=>{
            Axios.get(`http://localhost:4000/data`)
            .then((res)=>{
                this.state.inputNama.current.value=''
                this.state.inputUsia.current.value=''
                this.state.inputPekerjaan.current.value=''
                this.setState({data:res.data})
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })
    }
    DeletePostid=(id,index)=>{
        MySwal.fire({
            title: `Are you sure wanna delete ${this.state.data[index].nama} ?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.value) {
                Axios.delete(`http://localhost:4000/data/${id}`)
                .then(()=>{
                    Axios.get('http://localhost:4000/data')
                    .then((res)=>{
                        this.setState({category:null})
                        this.setState({data:res.data})
                        MySwal.fire(
                          `Deleted!`,
                          `${this.state.data[index].nama} has been deleted.`,
                          'success'
                        )
                    }).catch((err)=>{
                        console.log(err)
                    })
                }).catch((err)=>{
                    console.log(err)
                })
            }
          })
    }
    editData=async (input)=>{

        console.log(input)
        await Axios.get(`http://localhost:4000/data?id=${input}`)
        .then((res)=>{
            console.log(res)
            this.setState({dataEdit:res.data})
        }).catch((err)=>{
            console.log(err)
        })
        console.log(this.state.dataEdit)
        this.setState({isOpen:true})
    }
    saveEdit=(id)=>{
        console.log(id)
        let nama=this.state.inputNamaEdit.current.value
        let usia=this.state.inputUsiaEdit.current.value
        let pekerjaan=this.state.inputPekerjaanEdit.current.value
        let sentData={
            nama,
            usia,
            pekerjaan
        }
        Axios.put(`http://localhost:4000/data/${id}`,sentData)
        .then(()=>{
            Axios.get('http://localhost:4000/data/')
            .then((res)=>{
                this.setState({category:null})
                this.setState({data:res.data})
                this.setState({isOpen:false})
            }).catch((err)=>{
                console.log(err)
            })
        })
    }
    closeEditModal=()=>{
        this.setState({isOpen:false})
    }

    toggleedit = () => this.setState({isOpen:!this.state.isOpen})

    deleteAllData=()=>{
        
        MySwal.fire({
            title: `Are you sure wanna delete all data ?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.value){
                Axios.get(`http://localhost:4000/data`)
                  .then((res)=>{
                      this.setState({data:res.data})
                      this.state.data.map((val,index)=>{
                          Axios.delete(`http://localhost:4000/data/${val.id}`)
                          .then(()=>{
                              Axios.get(`http://localhost:4000/data`)
                              .then((res)=>{
                                  this.setState({data:res.data})
                                  this.setState({category:null})
                                  MySwal.fire(
                                      `Deleted!`,
                                      `All has been deleted.`,
                                      'success'
                                    )
                              }).catch((err)=>{
                                  console.log(err)
                              })
          
                          }).catch((err)=>{
                              console.log(err)
                          })
                      })
                  }).catch((err)=>{
                      console.log(err)
                  })
                
            }  
          })
    }
    getDataFilter=()=>{
        Axios.get(`http://localhost:4000/data?pekerjaan=${this.state.category}`)
            .then((res)=>{
                this.setState({dataFilter:res.data})
                
            }).catch((err)=>{
                console.log(err)
            })
    }
    filter=()=>{
        this.setState({category:this.state.filterCategory.current.value})
        this.setState({stop:false})
        
        // let pekerjaan=this.state.filterCategory.current.value
        // Axios.get(`http://localhost:4000/data?pekerjaan=${pekerjaan}`)
        // .then((res)=>{
        //     this.setState({data:res.data})
        // }).catch((err)=>{
        //     console.log(err)
        // })
    }

    renderCategory=()=>{
        return this.state.data.map((val,index)=>{
            return(
                <>
                    <option>{val.pekerjaan}</option>
                </>
            )
        })
    }

    renderData=()=>{
        if(this.state.category==="Filter By Pekerjaan") this.setState({category:null})
        if(this.state.category===null){
            console.log("jalan null")
            console.log(this.state.data)
            return this.state.data.map((val,index)=>{
                return(
                    <tr key={index}>
                        <td>{val.nama}</td>
                        <td>{val.usia}</td>
                        <td>{val.pekerjaan}</td>
                        <td>
                            <button className='btn btn-primary mr-2' onClick={()=>this.editData(val.id,index)}> <FiEdit/></button>
                            <button className='btn btn-danger' onClick={()=>this.DeletePostid(val.id,index)}> <MdDeleteForever/></button>
                        </td>
                    </tr>
                )
            })
        }else{
            if(!this.state.stop){
                this.getDataFilter()
                this.setState({stop:true})
            }
            console.log(this.state.dataFilter)
                return this.state.dataFilter.map((val,index)=>{
                    return(
                        <tr key={index}>
                            <td>{val.nama}</td>
                            <td>{val.usia}</td>
                            <td>{val.pekerjaan}</td>
                            <td>
                                <button className='btn btn-primary mr-2' onClick={()=>this.editData(val.id,index)}> <FiEdit/></button>
                                <button className='btn btn-danger' onClick={()=>this.DeletePostid(val.id,index)}> <MdDeleteForever/></button>
                            </td>
                        </tr>
                    )
                })
            
        }
    }
    
    render(){
        return(
            <div>
                {
                    this.state.dataEdit.length?
                    <Modal isOpen={this.state.isOpen} toggle={this.toggleedit} >
                        <ModalHeader toggle={this.toggleedit}>edit data {this.state.dataEdit.length?this.state.dataEdit[0].nama:''}</ModalHeader>
                        <ModalBody>
                        <div className='col-md-12'> <input type='text' className='form-control' placeholder='Nama' defaultValue={this.state.dataEdit[0].nama} ref={this.state.inputNamaEdit}/> </div>
                        <div className='col-md-12'> <input type='text' className='form-control' placeholder='Usia' defaultValue={this.state.dataEdit[0].usia} ref={this.state.inputUsiaEdit}/> </div>
                        <div className='col-md-12'> <input type='text' className='form-control' placeholder='Pekerjaan' defaultValue={this.state.dataEdit[0].pekerjaan}  ref={this.state.inputPekerjaanEdit}/> </div>
                            
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={()=>this.saveEdit(this.state.dataEdit[0].id)}>save</Button>
                            <Button color="secondary" onClick={this.toggleedit}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                    :
                    null
                }
                <h1>SOAL 1</h1>
                <div className='row'>
                    <div className='col-md-4 mb-4'>
                        <select className='form-control' ref={this.state.filterCategory} onChange={()=>this.filter()}>
                            <option>Filter By Pekerjaan</option>
                            {this.renderCategory()}
                        </select>
                    </div>
                    <div className='col-md-4 mb-4'>
                        <button className="btn btn-danger" onClick={this.deleteAllData}>
                            Delete All Data
                        </button>
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
                        {this.renderData()}
                    </tbody>
                </table>
                <div className='row'>
                    <div className='col-md-3'> <input type='text' className='form-control' placeholder='Nama' ref={this.state.inputNama}/> </div>
                    <div className='col-md-3'> <input type='text' className='form-control' placeholder='Usia' ref={this.state.inputUsia}/> </div>
                    <div className='col-md-3'> <input type='text' className='form-control' placeholder='Pekerjaan' ref={this.state.inputPekerjaan}/> </div>
                    <div className='col-md-3'> <input type='button' className='form-control btn-info' value='add Data' onClick={this.addPostClick} /> </div>
                </div>
            </div>
        )
    }
}

export default Home