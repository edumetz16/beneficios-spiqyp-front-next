import { useState } from "react";
import { UseSearchBoxProps, useInstantSearch, useSearchBox } from "react-instantsearch";

interface SearchBoxProps{
    dictionary:any;
}

function CustomSearchBox({dictionary}:SearchBoxProps, props: UseSearchBoxProps ) {
    const { query, refine } = useSearchBox(props);
    const [inputValue, setInputValue] = useState(query);
    
    function setQuery(newQuery: string) {
      setInputValue(newQuery);
      refine(newQuery);
    }
  
    return (
      <div className='w-full mb-6 relative'>
          <input
            className='text-black w-full px-4 py-2 rounded border border-primary'
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder={"Busqueda"}
            spellCheck={false}
            maxLength={512}
            
            value={inputValue}
            onChange={(event) => {
              setQuery(event.currentTarget.value);
            }}
          />
          <div className='absolute top-2 right-4'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M20.71 19.29L17.31 15.9C18.407 14.5024 19.0022 12.7767 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.6789 21.1021 20.3121 21.1047 20.7042 20.7158C20.7061 20.7139 20.7081 20.7119 20.71 20.71V20.71C21.1021 20.3211 21.1047 19.6879 20.7158 19.2958C20.7139 19.2939 20.7119 19.2919 20.71 19.29L20.71 19.29ZM5 11V11C5 7.68629 7.68629 5 11 5C14.3137 5 17 7.68629 17 11C17 14.3137 14.3137 17 11 17C7.68629 17 5 14.3137 5 11L5 11Z" fill="#BDBDBD"/>
            </svg>
          </div>
          
      </div>
    );
  }

export default CustomSearchBox;