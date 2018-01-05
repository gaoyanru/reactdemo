import { connect } from 'react-redux'
import { login } from '@/store/actions'
import Login from '@/container/Login'

const mapStateToProps = ({common}) => {
  return {
    loading: common.loading,
    isLogin: common.isLogin
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onLogin: payload => {
      dispatch(login(payload))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
