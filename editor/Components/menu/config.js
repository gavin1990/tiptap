const FONT_PX_SIZES = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 40, 48, 60, 72, 90]
const LINE_SPACING_VALUES = ['100%', '115%', '150%', '200%', '300%', '400%', '500%']
const HEADING_LEVEL = [1, 2, 3, 4, 5, 6]
const FONT_TYPE_NAMES = [
  // SERIF
  'Arial',
  'Arial Black',
  'Georgia',
  'Tahoma',
  'Times New Roman',
  'Times',
  'Verdana',
  // MONOSPACE
  'Courier New',
  'Lucida Console',
  'Monaco',
  'monospace',
]
export const FONT_PX_SIZE_COMMANDS = commands => {
  return FONT_PX_SIZES.reduce((cmd, size) => {
    cmd.push({
      name: `${size}px`,
      command: commands.font_size,
      active: size,
      attrs: {
        px: size
      }
    })
    return cmd
  }, [])
}

export const LINE_SPACING_COMMANDS = commands => {
  return LINE_SPACING_VALUES.reduce((cmd, value) => {
    cmd.push({
      name: `${value}`,
      command: commands.line_spacing,
      active: value,
      attrs: {
        lineSpacing: `${value}`
      }
    })
    return cmd
  }, [{
    name: 'Default',
    command: commands.line_spacing,
    active: '',
    attrs: {
      lineSpacing: ''
    }
  }])
}
export const FONT_TYPE_COMMANDS = commands => {
  return FONT_TYPE_NAMES.reduce((cmd, name) => {
    cmd.push({
      name: `${name}`,
      command: commands.font_family,
      active: name,
      attrs: {
        name: name
      }
    })
    return cmd
  }, [])
}
export const HEADING_LEVEL_COMMANDS = extend => {
  let list = HEADING_LEVEL.reduce((cmd, level) => {
    cmd.push({
      name: `Heading ${level}`,
      attrs: {
        level: level
      },
      commandCode: 'heading'
    })
    return cmd
  }, [])
  if (extend) {
    let Paragraph = [{
      name: 'Paragraph',
      commandCode: 'paragraph'
    }]
    list = Paragraph.concat(list)
  }
  return list
}

export const TEXT_COLOR_COMMAMD_LIST = commands => {
  return [
    {
      name: 'Text Color',
      type: 'text_color',
      command: commands.text_color,
      picker: false,
      attrsName: 'color',
      selectAttrs: 'color',
      icon: 'icon-text-color'
    },
    {
      name: 'Text Background Color',
      type: 'text_background_color',
      command: commands.text_background_color,
      picker: false,
      attrsName: 'background',
      selectAttrs: 'background',
      icon: 'icon-background-color'
    }
  ]
}
export const TEXT_ALIGN_COMMAMD_LIST = commands => {
  return [
    {
      name: 'Align Left',
      command: commands.align,
      attrs: { align: 'left' },
      icon: 'icon-alignleft'
    },
    {
      name: 'Align Center',
      command: commands.align,
      attrs: { align: 'center' },
      icon: 'icon-align-center'
    },
    {
      name: 'Align Right',
      command: commands.align,
      attrs: { align: 'right' },
      icon: 'icon-align-right'
    }
  ]
}

export const LIST_COMMANDS = commands => {
  return [
    {
      name: 'Bullet List',
      commandCode: 'bullet_list',
      icon: 'icon-bullet-list'
    },
    {
      name: 'Ordered List',
      commandCode: 'ordered_list',
      icon: 'icon-numbered-list'
    },
    {
      name: 'Increase Indent',
      command: commands.indent,
      attrs: { type: 'increase' },
      icon: 'icon-indent-right'
    },
    {
      name: 'Decrease Indent',
      command: commands.indent,
      attrs: { type: 'decrease' },
      icon: 'icon-indent-left'
    }
  ]
}

export const BLOCK_COMMANDS_LIST = [
  {
    name: 'Code Inline',
    commandCode: 'code',
    icon: 'icon-code'
  },
  {
    name: 'Code Block',
    commandCode: 'code_block',
    icon: 'icon-code-block'
  },
  {
    name: 'Blockquote',
    commandCode: 'blockquote',
    icon: 'icon-blockquote'
  }
]

export const EDIT_COMMANDS_LIST = commands => {
  return [
    {
      name: 'Undo',
      command: commands.undo,
      icon: 'icon-undo'
    },
    {
      name: 'Redo',
      command: commands.redo,
      icon: 'icon-redo'
    }
  ]
}

export const FORMAT_COMMANDS_LIST = [
  {
    name: 'Bold',
    commandCode: 'bold',
    icon: 'icon-bold'
  },
  {
    name: 'Italic',
    commandCode: 'italic',
    icon: 'icon-italic'
  },
  {
    name: 'Strike',
    commandCode: 'strike',
    icon: 'icon-strike-through'
  },
  {
    name: 'Underline',
    commandCode: 'underline',
    icon: 'icon-underline'
  },
  {
    name: 'Superscript',
    commandCode: 'sup',
    icon: 'icon-superscript'
  },
  {
    name: 'Subscript',
    commandCode: 'sub',
    icon: 'icon-subscript'
  }
]

export const TABLE_COMMANDS_LIST = [
  {
    name: 'Insert Table',
    commandCode: 'table',
    commandType: 'insertTable',
    child: true,
    icon: 'icon-inserttable'
  },
  {
    name: 'Delete Table',
    commandCode: 'table',
    commandType: 'deleteTable',
    icon: ''
  },
  {
    name: 'Row',
    child: true,
    commandCode: 'table',
    list: [{
        name: 'Add Row Before',
        commandCode: 'table',
        commandType: 'addRowBefore'
      },
      {
        name: 'Add Row After',
        commandCode: 'table',
        commandType: 'addRowAfter'
      },
      {
        name: 'Toggle Header Row',
        commandCode: 'table',
        commandType: 'toggleHeaderRow'
      },
      {
        name: 'Delete Row',
        commandCode: 'table',
        commandType: 'deleteRow'
      }
    ]
  },
  {
    name: 'Col',
    commandCode: 'table',
    child: true,
    list: [{
        name: 'Add Column Before',
        commandCode: 'table',
        commandType: 'addColumnBefore'
      },
      {
        name: 'Add Column After',
        commandCode: 'table',
        commandType: 'addColumnAfter'
      },
      {
        name: 'Toggle Header Column',
        commandCode: 'table',
        commandType: 'toggleHeaderColumn'
      },
      {
        name: 'Delete Column',
        commandCode: 'table',
        commandType: 'deleteColumn'
      }
    ]
  },
  {
    name: 'MergeCells',
    commandCode: 'table',
    commandType: 'mergeCells',
    icon: ''
  },
  {
    name: 'SplitCell',
    commandCode: 'table',
    commandType: 'splitCell',
    icon: ''
  },
  {
    name: 'SetCellBackground',
    commandCode: 'table',
    commandType: 'setCellBackground',
    child: true,
    picker: false,
    attrsName: 'color',
    type: 'color'
  },
  {
    name: 'RemoveCellBackground',
    commandCode: 'table',
    commandType: 'removeCellBackground',
    icon: ''
  },
  {
    name: 'VerticalAlign',
    child: true,
    commandCode: 'table',
    list: [{
        name: 'Top',
        commandCode: 'table',
        commandType: 'verticalAlign',
        attrs: {
          options: {
            vertical: 'top'
          }
        },
        icon: ''
      },
      {
        name: 'Middle',
        commandCode: 'table',
        commandType: 'verticalAlign',
        attrs: {
          options: {
            vertical: 'middle'
          }
        },
        icon: ''
      },
      {
        name: 'Bottom',
        commandCode: 'table',
        commandType: 'verticalAlign',
        attrs: {
          options: {
            vertical: 'bottom'
          }
        },
        icon: ''
      }
    ]
  }
]

export const INSERT_BAR_LIST = [
  {
    name: 'Table',
    icon: 'icon-inserttable',
    list: TABLE_COMMANDS_LIST
  },
  {
    name: 'Image',
    commandCode: 'image',
    commandAfterClose: true,
    icon: 'icon-image'
  },
  {
    name: 'Link',
    commandCode: 'link',
    icon: 'icon-link'
  },
  {
    name: 'Horizontal Line',
    commandCode: 'hr',
    icon: 'icon-horizontal'
  }
]