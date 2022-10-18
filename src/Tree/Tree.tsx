import {FolderBar} from '@/Tree/FolderBar'
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined'
import {Button} from '@mui/material'
import {treeStore} from '@/store/tree'
import {TreeRender} from '@/Tree/Item'
import {useEffect, useRef, useState} from 'react'
import {TreeMark} from '@/Tree/Mark'
import {TreeContext} from '@/Tree/Context'
import {observer} from 'mobx-react-lite'
import {configStore} from '@/store/config'
import {ScrollBox} from '@/components/ScrollBox'

export const Tree = observer(() => {
  const box = useRef<HTMLDivElement>(null)
  return (
    <div className={'h-full'}>
      <FolderBar/>
      <ScrollBox
        mode={'xy'}
        className={'border-1 border-r border-solid h-[calc(100%_-_28px)]'}
      >
        <div
          className={'pb-20 min-h-[calc(100vh_-_60px)]'}
          onClick={(e) => {
            if ((e.target as HTMLElement).getAttribute('id') === 'tree' && treeStore.root) {
              treeStore.selectNode(treeStore.root, true)
            }
          }}
          id={'tree'}
          onDrop={() => {
            treeStore.moveToFolder(treeStore.root!.path)
          }}>
          {!!treeStore.root &&
            <div className={'relative'} ref={box}>
              <TreeRender node={treeStore.root}/>
              <TreeMark box={box}/>
              <TreeContext/>
            </div>
          }
          {!treeStore.root &&
            <div className={'mt-32 flex justify-center flex-col items-center'}>
              <span
                className={'text-gray-200 text-sm mb-4 px-6 text-center'}>{configStore.getI18nText('tree.openTip')}</span>
              <Button
                variant={'contained'}
                size={'small'}
                onClick={() => {
                  treeStore.openSelectDir()
                }}
                startIcon={<CreateNewFolderOutlinedIcon/>}>
                {configStore.getI18nText('tree.openFolder')}
              </Button>
            </div>
          }
        </div>
      </ScrollBox>
    </div>
  )
})
