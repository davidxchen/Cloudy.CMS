﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Cloudy.CMS.UI.FormSupport
{
    public class FormAttribute : Attribute
    {
        public string Id { get; }

        public FormAttribute(string id)
        {
            Id = id;
        }
    }
}
