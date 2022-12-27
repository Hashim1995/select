import Select from "./Select"
const App = () => {

  const options = [
    {
      value: '1',
      label: 'Azerbaijan'
    },
    {
      value: '2',
      label: 'Turkey'
    },
    {
      value: '3',
      label: 'Israel'
    },
    {
      value: '4',
      label: 'Hungary'
    },
    {
      value: '5',
      label: 'England'
    },
    {
      value: '6',
      label: 'Spain'
    },
    {
      value: '7',
      label: 'Germany'
    },
    {
      value: '8',
      label: 'Japan'
    }, {
      value: '9',
      label: 'Denmark'
    },
    {
      value: '10',
      label: 'Portugal'
    }, {
      value: '11',
      label: 'USA'
    },
  ]


  return <Select options={options} />
}

export default App