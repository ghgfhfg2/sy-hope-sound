import Link from 'next/link';
import styled from 'styled-components';

const LeftMenu = styled.nav`
width: 200px;border-right: 1px solid #ddd;
.depth_1{
  display:flex;flex-direction:column;margin:10px 0;
  >li{display:flex;margin:5px 0}
  >li>a{padding:0 15px;}
}  
`

function LeftMunu() {
  return (
    <>
      <LeftMenu >
        <ul className='depth_1'>
          <li>
            <Link href="/insa" >insa</Link>
          </li>
          <li>
            <Link href="/schedule" >schedule</Link>
          </li>
        </ul>
      </LeftMenu>
    </>
  )
}

export default LeftMunu