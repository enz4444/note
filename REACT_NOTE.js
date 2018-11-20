/*
  # conditional rendering
*/
// Immediately-invoked function expressions (IIFE)
{
  (() => {
    const handler = view 
                ? this.handleEdit 
                : this.handleSave;
    const label = view ? 'Edit' : 'Save';
          
    return (
      <button onClick={handler}>
        {label}
      </button>
    );
  })()
} 


// Short-circuit operator
{
  !view && (
    <p>
      <input
        onChange={this.handleChange}
        value={this.state.inputText} />
    </p>
  )
}


// Ternary operator
// condition ? expr_if_true : expr_if_false
{view ? 'Edit' : 'Save'}


// Subcomponents
const SaveComponent = (props) => {
  return (
    <div>
      <p>
        <input
          onChange={props.handleChange}
          value={props.text}
        />
      </p>
      <button onClick={props.handleSave}>
        Save
      </button>
    </div>
  );
};

const EditComponent = (props) => {
  return (
    <button onClick={props.handleEdit}>
      Edit
    </button>
  );
};
// inside render
{
  view
    ? <EditComponent handleEdit={this.handleEdit}  />
    : (
      <SaveComponent 
       handleChange={this.handleChange}
       handleSave={this.handleSave}
       text={this.state.inputText}
     />
    )
}


// Higher-order components
const SaveComponent = (props) => {
  return (
    <div>
      <p>
        <input
          onChange={props.handleChange}
          value={props.text}
        />
      </p>
      <button onClick={props.handleSave}>
        Save
      </button>
    </div>
  );
};

const EditComponent = (props) => {
  return (
    <button onClick={props.handleEdit}>
      Edit
    </button>
  );
};

const withEither = (conditionalRenderingFn, EitherComponent) => (Component) => (props) =>
  conditionalRenderingFn(props)
    ? <EitherComponent { ...props } />
    : <Component { ...props } />;

const isViewConditionFn = (props) => props.mode === 'view';

const withEditContionalRendering = withEither(isViewConditionFn, EditComponent);
const EditSaveWithConditionalRendering = withEditContionalRendering(SaveComponent);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {text: '', inputText: '', mode:'view'};
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }
  
  handleChange(e) {
    this.setState({ inputText: e.target.value });
  }
  
  handleSave() {
    this.setState({text: this.state.inputText, mode: 'view'});
  }

  handleEdit() {
    this.setState({mode: 'edit'});
  }
  
  render () {    
    return (
      <div>
        <p>Text: {this.state.text}</p>
        <EditSaveWithConditionalRendering 
               mode={this.state.mode}
               handleEdit={this.handleEdit}
               handleChange={this.handleChange}
               handleSave={this.handleSave}
               text={this.state.inputText}
             />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
