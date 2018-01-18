 
 class Userapp extends React.Component {
	constructor(props) {
		super(props);
		this.handleUserChoice = this.handleUserChoice.bind(this);
	}
	handleUserChoice(event) {
		this.setState({userchoice : event.target.id});
	}

	render() {
		return (
			<div className="reactapp"><Userlist handleUserChoice={this.handleUserChoice}/>
			</div>
			)
	}
}
class Userlist extends React.Component {
	constructor(props) {
		super(props);
		this.state = {messages : [],
			inputValue1 : "",
			shouldUpdate : 0};
			this.handleSubmit1 = this.handleSubmit1.bind(this);
			this.handleChange1 = this.handleChange1.bind(this); 
			this.handleImageClick = this.handleImageClick.bind(this);           
		}
		handleChange1(event) {
			this.setState({inputValue1: event.target.value});
		}

		handleImageClick = (prm) => (event) => { 
			var cImg = this.refs["img" + prm];
			if(!cImg.classList.contains('imgClicked')){
				cImg.classList.add('imgClicked');
			}else{
				cImg.classList.remove('imgClicked');
			}
		}   

		handleSubmit1(event) {
			event.preventDefault();
			if(this.refs.fileInput.files[0].type == "image/png" || this.refs.fileInput.files[0].type == "image/jpeg"){
				const config = {
					headers: { 'content-type': 'multipart/form-data' }
				};
				var data = new FormData();
				data.append("message", this.state.inputValue1);
				//console.log(this.refs.fileInput.files[0].type);
				data.append("fileInput", this.refs.fileInput.files[0], this.refs.fileInput.files[0].type);     
				axios.post('/addmsg', data, config)
				.then(function(response){
				});
			} else {
				alert("Недопустимый формат файла.");
			}
			this.refs.messageInput.value = '';
			this.refs.fileInput.value = '';
			this.setState({inputValue1: ""});
			this.forceUpdate();
			this.setState({shouldUpdate : 1});
		}    

		componentWillMount() {
			var list = []
			axios.get('/messages')
			.then(response =>{
				var regexp = />>\d+/g;
				response.data.forEach((item, i, arr) => {
					if(regexp.test(item.message)){
						item.message = item.message.replace(regexp, (str)=>{
							var replaceStr = str;
							response.data.forEach((item2, j, arrr) => {
								if(item2.id == (str.slice(2))){
									var newHref = "#" + str.slice(2);
									replaceStr =  "<a class='replyLink' href=" + newHref + ">" + str + "</a>";
								}
							});
							return replaceStr;
						});
					}else{
					}

					list.push(item);
				});
				setTimeout(() =>{

					this.setState({shouldUpdate : 1});
					this.forceUpdate();
				}, 5000);

				this.setState({ messages: list })
			}); 
		}

		componentDidUpdate() {
			var list = []
			if(this.state.shouldUpdate){
				axios.get('/messages')
				.then(response =>{
					var regexp = />>\d+/g;
					response.data.forEach((item, i, arr) => {	        
						if(regexp.test(item.message)){		        
							item.message = item.message.replace(regexp, (str)=>{
								var replaceStr = str;
								response.data.forEach((item2, j, arrr) => {

									if(item2.id == (str.slice(2))){
										var newHref = "#" + str.slice(2);
										replaceStr =  "<a class='replyLink' href=" + newHref + ">" + str + "</a>";
									}
								});
								return replaceStr;
							});
						}else{
						}
						list.push(item);
					});
					this.setState({ messages: list })
				}); 
				this.setState({shouldUpdate : 0});
				setTimeout(() =>{

					this.setState({shouldUpdate : 1});
					this.forceUpdate();
				}, 5000);
			}
		}
		render() {

			return (
				<div>
				<div className="posts">
				<a className="replyLink" href="#form">Вниз</a>
				{this.state.messages.map((listValue) => {
					return <div className="postWrapper" id={listValue.id}>
					<div className="postInlineWrapper">

					<div className="postHeader">
					<span>Аноним</span>
					<span>{listValue.time}</span>
					<span>№{listValue.id}</span>                  		
					</div>
					<div className="postContent">
					{listValue.image != "" &&
					<div className="imageWrapper">
					<img align="left" ref={"img" + listValue.id} className="postImage" src={(listValue.image)} onClick={this.handleImageClick(listValue.id)} /></div>
				} 
				<div className="post" onClick={this.props.handleUserChoice} dangerouslySetInnerHTML={{__html: listValue.message}}/>
				</div>
				</div>
				</div>;

			})}
				</div>
				<form id="form" enctype="multipart/form-data" ref="messageForm" onSubmit={this.handleSubmit1} accept="image/png, image/jpeg">
				<textarea value={this.state.value1} onChange={this.handleChange1} ref="messageInput" />
				<input type="file" name="fileInput" ref="fileInput" id="fileInput" />
				<input type="submit" value="Хуяк" />
				</form>
				</div>
				)
		}
	}


	ReactDOM.render(
		<Userapp/>, 
		document.getElementById("reactapp") 
		)