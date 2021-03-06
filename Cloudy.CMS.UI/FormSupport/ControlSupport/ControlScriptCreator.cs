﻿using Cloudy.CMS.UI.ScriptSupport;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace Cloudy.CMS.UI.FormSupport.ControlSupport
{
    public class ControlScriptCreator : IScriptCreator
    {
        IControlProvider ControlProvider { get; }

        public ControlScriptCreator(IControlProvider controlProvider)
        {
            ControlProvider = controlProvider;
        }

        public IEnumerable<ScriptDescriptor> Create()
        {
            var result = new List<ScriptDescriptor>();

            foreach(var control in ControlProvider.GetAll())
            {
                foreach(var script in control.Type.GetCustomAttributes<ScriptAttribute>())
                {
                    result.Add(new ScriptDescriptor(script.Path));
                }
            }

            return result.AsReadOnly();
        }
    }
}
