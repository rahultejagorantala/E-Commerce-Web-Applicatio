import React, {Component} from 'react';
import {connect} from 'react-redux';
import LoaderGif from '../assets/img/loader.gif'

class FullPageLoader extends Component {
    state = {  }


    render() { 
        const {loading} = this.props;

        if(!loading) return null;

        return ( 
            <div className="loader-container">
                <div className="loader">
                    <img src={LoaderGif} />
                </div>
            </div>
         );
    }
}


const mapStateToProps = (state)=>{
    return {loading:state.loading.loading}
}

export default connect(mapStateToProps)(FullPageLoader);