import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import {AiOutlineEdit} from 'react-icons/ai';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import { BsInfoCircle} from 'react-icons/bs';

const Home = () => {
    const [QueryLogs, setQueryLog] = useState([]);
    const[loading, setLoading] = useState(false);
    useEffect(() => {setLoading(true);
    axios.get('http://localhost:5555/querylogs').then((response) => {
        setQueryLog(response.data.data);
        setLoading(false);
    }).catch( (error) => {
        console.log(error);
        setLoading(false)
     });
    },[]);

    
  return (
    <div className='p-4'>
        <div className='flex justify-between items-center'>
            <h1 className='text-3xl my-8'> QueryLog List</h1>
            <Link to='/querylog/create'>
            <MdOutlineAddBox className='text-sky-800 text-4xl' />
            
            </Link>
        </div>
        {loading ? (<Spinner />) : (<table className='w-full border-seperate border-spacing-2'>
            <thead>
                <tr>
                    <th className='border border-slate-600 rounded-md'> No</th>
                    <th className='border border-slate-600 rounded-md'> Conv History User</th>
                    <th className='border border-slate-600 rounded-md'> Conv History Bot</th>
                    <th className='border border-slate-600 rounded-md max-md:hidden'> 
                        User Question</th>
                    <th className='border border-slate-600 rounded-md max-md:hidden'> 
                        Bot Answer</th>
                        <th className='border border-slate-600 rounded-md max-md:hidden'> 
                        Context</th>      
                </tr>
            </thead>
            <tbody>
                {QueryLogs.map((queryLog, index) => (
                    <tr key={BsBook._id} className='h-8'>
                        <td className='border border-slate-700 rounded-md text-center'>
                            {index+1}
                        </td>
                        <td className='border border-slate-700 rounded-md text-center'>
                            {QueryLogs.conversationHistory.user}
                        </td>
                        <td className='border border-slate-700 rounded-md text-center'>
                            {QueryLogs.conversationHistory.bot}
                        </td>
                        <td className='border border-slate-700 rounded-md text-center'>
                            {QueryLogs.userQuestion}
                        </td>
                        <td className='border border-slate-700 rounded-md text-center'>
                            {QueryLogs.BotAnswer}
                        </td>
                       

                    </tr>

                ))}

            </tbody>

        </table>)
    }


        
    </div>
  )
}

export default Home