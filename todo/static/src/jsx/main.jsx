

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [], text: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.rpc = new Rpc();

    this.model = 'todo.todo';
    this.context = {lang:"en_US",tz:"Europe/Brussels",uid:2};

    this.fetch();
    
  }

  fetch() {
    var params = {
        model: this.model,
        context: this.context,
        method: 'search_read',
        fields: ['id', 'name']
    };

    this.rpc.query(params)
      .then(res => {        
        let items = [];
        for (let i = 0; i < res.length; i ++) {
          items.push({id: res[i].id, text: res[i].name});
        }

        this.setState(state => ({
          items: items,
          text: ''
        }));
      })
      .catch(e => {
        console.error(e);
      });
  }

  save_to_server(newItem) {
    let args = [
      {name: newItem.text}
    ];

    let params = {
      model: this.model,
      method: 'create',
      args: args,
      kwargs: {
        context: this.context
      }
    }
    this.rpc.query(params)
      .then(res => {
        console.log(res);
      });
  }


  render() {
    return (
      <div>
        <h3>TODO</h3>
        <TodoList items={this.state.items} />
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="new-todo">
            What needs to be done?
          </label>
          <input
            id="new-todo"
            onChange={this.handleChange}
            value={this.state.text}
          />
          <button>
            Add #{this.state.items.length + 1}
          </button>
        </form>
      </div>
    );
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.text.length) {
      return;
    }
    const newItem = {
      text: this.state.text,
      id: Date.now()
    };
    this.setState(state => ({
      items: state.items.concat(newItem),
      text: ''
    }));
    this.save_to_server(newItem);
  }
}

class TodoList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.items.map(item => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    );
  }
}

ReactDOM.render(
  <TodoApp />,
  document.getElementById('todos-example')
);