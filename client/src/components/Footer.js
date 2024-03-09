import React from 'react'


class Footer extends React.Component {
    render() {
        return (
            <div>
            <footer className="text-center text-white" id="footer">

  <div className="container p-4 pb-0 footer navbar-fixed-bottom">
   
    <section className="">
      <form action="">
      
        <div className="row d-flex justify-content-center">
         
          <div className="col-auto">
            <p className="pt-2  text-white">
              <strong>Sign up for our newsletter</strong>
            </p>
          </div>
     

        
          <div className="col-md-5 col-12">
           
            <div className="form-outline form-white mb-4">
              <input type="email" id="form5Example2" className="form-control" />
              <label className="form-label" htmlFor  ="form5Example2">Email address</label>
            </div>
          </div>
        

       
          <div className="col-auto">
         
            <button type="submit" className="btn btn-outline-light mb-4">
              Subscribe
            </button>
          </div>
       
        </div>
       
      </form>
    </section>
 
  </div>
 
  <div  styles="background-color: rgba(0, 0, 0, 0.2);">
    <div className='row'>
      <div className='col-5'>
      <p className="d-flex text-white">Demo React-Redux App</p>
      </div>
      <div className='col-7'>
      <p className="d-flex text-white">Made with 💖 by Gaurav Singla</p>
  
      </div>

    </div>
   
    
  
  </div>

</footer>
            </div>
        )
    }
}

export default Footer