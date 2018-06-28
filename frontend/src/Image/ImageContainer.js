import Image from './Image';
import { connect } from 'react-redux';
import { imageUrlBuilder } from '../utils';
import Actions from '../actions';


const mapStateToProps = (state, ownProps) => {
    if(!ownProps.id) {
        return {};
    }
    const type = ownProps.type || 'main';

    const { maxWidth, stretch, clipLow, clipHigh, format } = state.image;

    return {
        id: ownProps.id,
        url: imageUrlBuilder(ownProps.id, {
            type,
            maxWidth,
            stretch,
            clipLow,
            clipHigh,
            format,
        }),
        options: state.image,
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const setOption = (option) => dispatch(Actions.Image.setOption(option));
    const setNumericOption = (name, value, min, max) => {
        if(value < min || value > max)
            return;
        setOption({[name]: value});
    } 
    return { setOption, setNumericOption };
};


const ImageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Image);


export default ImageContainer;
