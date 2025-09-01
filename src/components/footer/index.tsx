export default function Footer() {
  return (
    <footer className='w-full bg-eee border-t border-t-[#e9b03f] border-solid p-8 flex flex-col items-center justify-center gap-3'>
      <div className='flex items-center gap-4'>
        <p className='uppercase underline italic text-9e9e9e text-sm'>
          A Cemig
        </p>
        <p className='underline italic text-9e9e9e text-sm'>
          Política de Privacidade
        </p>
        <p className='underline italic text-9e9e9e text-sm'>Termo de Uso</p>
      </div>
      <div className='flex flex-col items-center gap-1'>
        <p className='text-[10px] text-aaaab7'>
          Copyright Cemig - Todos os direitos reservados
        </p>
        <p className='text-[10px] text-aaaab7'>Versão 47.3.0.0</p>
      </div>
    </footer>
  );
}
